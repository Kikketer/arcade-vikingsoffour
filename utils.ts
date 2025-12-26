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
}
