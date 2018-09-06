import axios from 'axios';
import toweek from './DateToWeek';
import { isEmpty } from 'lodash';

// let ac = [];

const iter = async(object, arr, ac, acc = [], date = []) => {
    const today = Date.now();
    if (!object.next) {
        date = object.values.map(element => new Date(element.date.substr(0,10))).filter(element => ((today - element) / 31536000000) < 1).map(element => {
            return toweek(element)
        });
        ac = acc.concat(date);
        // console.log('ac = ', ac)
        const a = ac.reduce((acc, el) => {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
          }, {});
        // console.log('a = ', a);
        if (!isEmpty(a)) {
            const keys = Object.keys(a).map(el => Number(el));
            keys.forEach(el => {
                if (arr[el-1].bitbucket === 0) {
                    arr[el-1].bitbucket = a[el];
                } else {
                    arr[el-1].bitbucket += a[el]
                }
            })
            // console.log('end arr =', arr)
            return arr;
        };
    } else {
        const res = await axios.get(object.next);
        date = object.values.map(element => new Date(element.date.substr(0,10))).filter(element => ((today - element) / 31536000000) < 1).map(element => {
            return toweek(element)
        });
        ac = acc.concat(date);
        return iter(res.data, ac);
    }
}

export default iter;
