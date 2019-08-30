function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}

export function switchDialog(fn, duration) {
    fn()
    await sleep(duration)
}

// export async function main(duration, dialogName) {
//     while(true) {
//         await switchDialog(duration, dialogName)
//     }
// }
