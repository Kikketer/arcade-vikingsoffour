namespace Utils {
    export function getDistanceBetweenSprites({
        spriteA,
        spriteB
    }: {
        spriteA: Sprite
        spriteB: Sprite
    }): number {
        const dx = spriteA.x - spriteB.x
        const dy = spriteA.y - spriteB.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    export function random(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        // The maximum is inclusive and the minimum is inclusive
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }
}
