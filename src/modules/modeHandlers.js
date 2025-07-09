export function handleModeChange() {
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    const controls = {
        algorithm: document.getElementById('algorithm'),
        runmode: document.getElementById('runmode'),
        targetNum: document.getElementById('target-num'),
        targetMass: document.getElementById('target-mass'),
        intify: document.getElementById('intify'),
        outputPrecision: document.getElementById('output-precision'),
        floatTolerance: document.getElementById('float-tolerance'),
        maxComb: document.getElementById('max-comb')
    };

    // Reset all controls
    Object.values(controls).forEach(control => {
        if (control) {
            control.disabled = false;
            control.parentElement.classList.remove('opacity-50');
        }
    });

    // Mode-specific rules
    const disableRules = {
        formula: ['algorithm', 'runmode', 'targetNum', 'targetMass', 'intify', 'floatTolerance', 'maxComb'],
        balance: ['runmode', 'targetNum', 'targetMass', 'outputPrecision'],
        masses: ['algorithm', 'maxComb']
    };

    disableRules[mode]?.forEach(controlName => {
        if (controls[controlName]) {
            controls[controlName].disabled = true;
            controls[controlName].parentElement.classList.add('opacity-50');
        }
    });
}