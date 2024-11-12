import { $SimpleLevelKubeEvent } from 'dev.latvian.mods.kubejs.level.SimpleLevelKubeEvent';
import { $CompoundTag } from 'net.minecraft.nbt.CompoundTag';
import { $Entity } from 'net.minecraft.world.entity.Entity';
import { $Level } from 'net.minecraft.world.level.Level';

namespace MinecartSpeed {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let MINECART_SPEED = 3;

    interface PlayerNbt extends $CompoundTag {
        RootVehicle?: {
            Entity?: {
                id: string,
                UUID: number[]
            }
        }
    }

    function ToHexStringWithPadding(number: number) {
        // Convert to unsigned hex
        let hex = (number >>> 0).toString(16);
        while (hex.length < 8) {
            // Add leading zeros if needed
            hex = `0${hex}`;
        }
        return hex;
    }

    function ConvertNbtUuidToHexString(uuidArray: number[]) {
        // Helper function to convert an integer to an 8-character hexadecimal string with zero padding

        // Convert each integer to hex with padding
        let hexParts = uuidArray.map((part) => ToHexStringWithPadding(part));

        // Format as UUID string: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        return `${hexParts[0]}-${hexParts[1].slice(0, 4)}-${hexParts[1].slice(4)}-${hexParts[2].slice(0, 4)}-${hexParts[2].slice(4)}${hexParts[3]}`;
    }

    function TargetPosIsSpeedAllowed(level: $Level, x: number, y: number, z: number) {
        let targetBlock = level.getBlock(x, y, z);
        if (targetBlock.getId().toString() == 'minecraft:powered_rail' && targetBlock.properties.powered == 'true') {
            return true;
        }

        if (targetBlock.getId().toString() == 'minecraft:rail') {
            let railShape = targetBlock.properties.shape;
            if (railShape === 'north_south' || railShape === 'east_west') {
                return true;
            }
        }

        return false;
    }

    function WorkOnZMotion(level: $Level, entity: $Entity) {
        if (entity.motionZ < 0) {
            // the target block is not a powered rail
            let targetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x(), entity.position().y(), entity.position().z() - MINECART_SPEED);
            if (!targetBlockIsOk) {
                return;
            }

            // check if the blocks between are all powered rails
            for (let z = 0; z < MINECART_SPEED; z++) {
                let subTargetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x(), entity.position().y(), entity.position().z() - z);
                if (!subTargetBlockIsOk) {
                    return;
                }
            }

            // for instant max vanilla speed
            entity.motionZ = -10;

            entity.setPosition(entity.position().x(), entity.position().y(), entity.position().z() - MINECART_SPEED);
        } else if (entity.motionZ > 0) {
            // the target block is not a powered rail
            let targetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x(), entity.position().y(), entity.position().z() + MINECART_SPEED);
            if (!targetBlockIsOk) {
                return;
            }

            // check if the blocks between are all powered rails
            for (let z = 0; z < MINECART_SPEED; z++) {
                let subTargetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x(), entity.position().y(), entity.position().z() + z);
                if (!subTargetBlockIsOk) {
                    return;
                }
            }

            // for instant max vanilla speed
            entity.motionZ = +10;

            entity.setPosition(entity.position().x(), entity.position().y(), entity.position().z() + MINECART_SPEED);
        }
    }

    function WorkOnXMotion(level: $Level, entity: $Entity) {
        if (entity.motionX < 0) {
            // the target block is not a powered rail
            let targetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x() - MINECART_SPEED, entity.position().y(), entity.position().z());
            if (!targetBlockIsOk) {
                return;
            }

            // check if the blocks between are all powered rails
            for (let z = 0; z < MINECART_SPEED; z++) {
                let subTargetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x() - z, entity.position().y(), entity.position().z());
                if (!subTargetBlockIsOk) {
                    return;
                }
            }

            // for instant max vanilla speed
            entity.motionX = -10;

            entity.setPosition(entity.position().x() - MINECART_SPEED, entity.position().y(), entity.position().z());
        } else if (entity.motionX > 0) {
            // the target block is not a powered rail
            let targetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x() + MINECART_SPEED, entity.position().y(), entity.position().z());
            if (!targetBlockIsOk) {
                return;
            }

            // check if the blocks between are all powered rails
            for (let z = 0; z < MINECART_SPEED; z++) {
                let subTargetBlockIsOk = TargetPosIsSpeedAllowed(level, entity.position().x() + z, entity.position().y(), entity.position().z());
                if (!subTargetBlockIsOk) {
                    return;
                }
            }

            // for instant max vanilla speed
            entity.motionX = +10;

            entity.setPosition(entity.position().x() + MINECART_SPEED, entity.position().y(), entity.position().z());
        }
    }

    export function LevelEventTick(event: $SimpleLevelKubeEvent): void {
        let level = event.level;
        let players = level.players;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (!player.vehicle) {
                continue;
            }

            let nbt = player.nbt as PlayerNbt;
            let rootVehicle = nbt.RootVehicle;
            if (rootVehicle?.Entity && rootVehicle.Entity.id == 'minecraft:minecart') {
                // Position of the player riding the minecart
                let minecartPos = player.blockPosition();
                // thats the rail
                let posRail = { x: minecartPos.x, y: minecartPos.y + 1, z: minecartPos.z };
                if (TargetPosIsSpeedAllowed(level, posRail.x, posRail.y, posRail.z)) {
                    let minecartUUID = rootVehicle.Entity.UUID;
                    let uuidString = ConvertNbtUuidToHexString(minecartUUID);

                    let entities = level.entities;

                    for (let i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        if (entity.type != 'minecraft:minecart') {
                            continue;
                        }
                        if (entity.uuid.toString() != uuidString) {
                            continue;
                        }

                        // dont do anything when we go up or down
                        if (entity.motionY != 0) {
                            return;
                        }

                        WorkOnZMotion(level, entity);
                        WorkOnXMotion(level, entity);
                    }
                }
            }
        }
    };
}

LevelEvents.tick((event) => {
    MinecartSpeed.LevelEventTick(event);
});
