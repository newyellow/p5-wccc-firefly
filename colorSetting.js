function getRandomColorSet() {
    
    let sets = [];
    sets.push({'grassHue': 220, 'rippleHue': 180, 'fireflyHue': 60});
    sets.push({'grassHue': 120, 'rippleHue': 320, 'fireflyHue': 60});
    sets.push({'grassHue': 260, 'rippleHue': 220, 'fireflyHue': 30});
    sets.push({'grassHue': 0, 'rippleHue': 80, 'fireflyHue': 160});
    return random(sets);
    // return sets[0];
}