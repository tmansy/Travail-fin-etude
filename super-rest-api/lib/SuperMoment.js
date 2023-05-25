"use strict";
exports.__esModule = true;
exports.SuperMoment = void 0;
exports.SuperMoment = {
    daysBetweenDates: function (startDate, endDate) {
        var now = startDate.clone();
        var dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.clone());
            now.add(1, 'days');
        }
        return dates;
    }
};
//# sourceMappingURL=SuperMoment.js.map