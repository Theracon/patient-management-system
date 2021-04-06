var functions = {};
var moment

// SET REFERRER THUMBNAIL IMAGE
functions.setReferrerTitle = function() {
    var docImage =
        'https://static.vecteezy.com/system/resources/thumbnails/000/424/145/small/Medical__28188_29.jpg';
    var otherImage =
        'https://www.pngkit.com/png/detail/281-2812821_user-account-management-logo-user-icon-png.png';
    var regexOne = /doctor/i;
    var regexTwo = /dr/i;
    var regexThree = /dr./i;
    
    if (
        regexOne.test(word) == true ||
        regexTwo.test(word) == true ||
        regexThree.test(word) == true
    ) { return docImage; }
    
    return otherImage;
}

// ADD ZERO TO SINGLE DIGIT MONTHS
functions.addZeroToMonth = function(digit) {
    if (digit.length == 1) {
        return digit;
    }

    return '0' + digit;
}

// GET TIME IN AM/PM FORMAT
functions.formatTime = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

functions.formatMessage = function(username, text) {
    return {
        username: username,
        text: text,
    }
}

module.exports = functions;