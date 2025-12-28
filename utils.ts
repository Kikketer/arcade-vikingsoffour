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

    export function bounceSprite(sprite: Sprite, target: { x: number, y: number }, amplitude: number = 3, frequency: number = 0.005) {
        if (!sprite || !target || target.x == null || target.y == null) return

        // Calculate the vertical position using a sine wave
        const time = game.runtime(); // milliseconds since start
        const yOffset = amplitude * Math.sin(frequency * time);

        sprite.y = target.y + amplitude + sprite.height + yOffset;
        sprite.x = target.x
    }
}
