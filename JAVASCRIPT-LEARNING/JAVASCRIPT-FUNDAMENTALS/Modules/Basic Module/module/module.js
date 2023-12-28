export var val = 10;
export var user_name = "joy"
// export   user_name;
let colors = fetch('../colors.json').then(colors => colors.json())
export default await colors;