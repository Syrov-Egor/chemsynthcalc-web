export function buttonRun(controlInput: object, textInput:string) {
    logInputs(controlInput, textInput)
}

function logInputs(controlInput: object, textInput:string) {
    console.log($state.snapshot(controlInput));
    console.log($state.snapshot(textInput));
}