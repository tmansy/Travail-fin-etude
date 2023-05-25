import moment from "moment";

export const SuperMoment = {

    daysBetweenDates : (startDate:moment.Moment, endDate:moment.Moment):Array<moment.Moment> => {

        const now = startDate.clone()
        const dates:Array<moment.Moment> = [];
    
        while (now.isSameOrBefore(endDate)) {
            dates.push( now.clone() );
            now.add(1, 'days');
        }
        return dates;
    }

}