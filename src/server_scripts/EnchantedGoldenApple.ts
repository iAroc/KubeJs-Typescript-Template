import { $RecipesKubeEvent } from 'dev.latvian.mods.kubejs.recipe.RecipesKubeEvent';

namespace EnchantedGoldenApple {
    export function ServerEventsRecipes(event: $RecipesKubeEvent): void {
        event.shaped(
            // arg 1: output item
            Item.of('minecraft:enchanted_golden_apple', 3),
            // arg 2: the shape (array of strings)
            [
                'AAA',
                'ABA',
                'AAA',
            ],
            // arg 3: the mapping object
            {
                A: 'minecraft:gold_block',
                B: 'minecraft:golden_apple',
            },
        )
    };
}

ServerEvents.recipes((event) => {
    EnchantedGoldenApple.ServerEventsRecipes(event);
});