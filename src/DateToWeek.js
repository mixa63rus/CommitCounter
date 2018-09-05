const toweek = (date) => {
    const today = Date.now();
    return Math.floor(52 - (today - date) / 604800000);
}

export default toweek;

// 604800000 - week
