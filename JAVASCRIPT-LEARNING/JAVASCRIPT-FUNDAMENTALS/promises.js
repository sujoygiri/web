function alarm(delay, person) {
    return new Promise((resolve, reject) => {
        if (delay < 0) {
            reject("Delay must not be negative");
        } else {
            setTimeout(() => {
                resolve(`Wake up ${person}`);
            }, delay);
        }
    });
}

