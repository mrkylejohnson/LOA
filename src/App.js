import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from "recharts";

const RAW_DATA = [
{"date":"Mar 1, 2026","bid":122,"win":86,"purchase":41},
{"date":"Feb 28, 2026","bid":138,"win":89,"purchase":48},
{"date":"Feb 27, 2026","bid":101,"win":71,"purchase":40},
{"date":"Feb 26, 2026","bid":104,"win":66,"purchase":43},
{"date":"Feb 25, 2026","bid":105,"win":65,"purchase":37},
{"date":"Feb 24, 2026","bid":118,"win":80,"purchase":54},
{"date":"Feb 23, 2026","bid":177,"win":128,"purchase":71},
{"date":"Feb 22, 2026","bid":314,"win":200,"purchase":123},
{"date":"Feb 21, 2026","bid":120,"win":79,"purchase":53},
{"date":"Feb 20, 2026","bid":117,"win":76,"purchase":56},
{"date":"Feb 19, 2026","bid":120,"win":86,"purchase":61},
{"date":"Feb 18, 2026","bid":119,"win":82,"purchase":58},
{"date":"Feb 17, 2026","bid":121,"win":82,"purchase":56},
{"date":"Feb 16, 2026","bid":142,"win":91,"purchase":57},
{"date":"Feb 15, 2026","bid":132,"win":97,"purchase":72},
{"date":"Feb 14, 2026","bid":133,"win":100,"purchase":73},
{"date":"Feb 13, 2026","bid":135,"win":94,"purchase":71},
{"date":"Feb 12, 2026","bid":136,"win":96,"purchase":69},
{"date":"Feb 11, 2026","bid":118,"win":90,"purchase":66},
{"date":"Feb 10, 2026","bid":118,"win":81,"purchase":61},
{"date":"Feb 9, 2026","bid":130,"win":96,"purchase":68},
{"date":"Feb 8, 2026","bid":143,"win":110,"purchase":81},
{"date":"Feb 7, 2026","bid":137,"win":104,"purchase":83},
{"date":"Feb 6, 2026","bid":122,"win":96,"purchase":64},
{"date":"Feb 5, 2026","bid":141,"win":97,"purchase":72},
{"date":"Feb 4, 2026","bid":140,"win":98,"purchase":71},
{"date":"Feb 3, 2026","bid":132,"win":100,"purchase":75},
{"date":"Feb 2, 2026","bid":138,"win":94,"purchase":75},
{"date":"Feb 1, 2026","bid":195,"win":138,"purchase":109},
{"date":"Jan 31, 2026","bid":168,"win":115,"purchase":88},
{"date":"Jan 30, 2026","bid":128,"win":88,"purchase":56},
{"date":"Jan 29, 2026","bid":118,"win":88,"purchase":68},
{"date":"Jan 28, 2026","bid":96,"win":71,"purchase":55},
{"date":"Jan 27, 2026","bid":113,"win":73,"purchase":52},
{"date":"Jan 26, 2026","bid":127,"win":69,"purchase":44},
{"date":"Jan 25, 2026","bid":131,"win":84,"purchase":55},
{"date":"Jan 24, 2026","bid":170,"win":122,"purchase":88},
{"date":"Jan 23, 2026","bid":164,"win":113,"purchase":90},
{"date":"Jan 22, 2026","bid":142,"win":101,"purchase":68},
{"date":"Jan 21, 2026","bid":132,"win":94,"purchase":70},
{"date":"Jan 20, 2026","bid":192,"win":147,"purchase":109},
{"date":"Jan 19, 2026","bid":246,"win":173,"purchase":116},
{"date":"Jan 18, 2026","bid":245,"win":185,"purchase":128},
{"date":"Jan 17, 2026","bid":368,"win":266,"purchase":206},
{"date":"Jan 16, 2026","bid":151,"win":98,"purchase":77},
{"date":"Jan 15, 2026","bid":141,"win":107,"purchase":85},
{"date":"Jan 14, 2026","bid":151,"win":119,"purchase":89},
{"date":"Jan 13, 2026","bid":138,"win":101,"purchase":79},
{"date":"Jan 12, 2026","bid":132,"win":105,"purchase":82},
{"date":"Jan 11, 2026","bid":156,"win":127,"purchase":103},
{"date":"Jan 10, 2026","bid":152,"win":110,"purchase":88},
{"date":"Jan 9, 2026","bid":116,"win":87,"purchase":65},
{"date":"Jan 8, 2026","bid":113,"win":82,"purchase":54},
{"date":"Jan 7, 2026","bid":130,"win":97,"purchase":69},
{"date":"Jan 6, 2026","bid":131,"win":99,"purchase":73},
{"date":"Jan 5, 2026","bid":144,"win":104,"purchase":78},
{"date":"Jan 4, 2026","bid":130,"win":97,"purchase":76},
{"date":"Jan 3, 2026","bid":116,"win":80,"purchase":60},
{"date":"Jan 2, 2026","bid":124,"win":87,"purchase":70},
{"date":"Jan 1, 2026","bid":100,"win":62,"purchase":50},
{"date":"Dec 31, 2025","bid":105,"win":62,"purchase":46},
{"date":"Dec 30, 2025","bid":113,"win":83,"purchase":55},
{"date":"Dec 29, 2025","bid":129,"win":90,"purchase":68},
{"date":"Dec 28, 2025","bid":144,"win":104,"purchase":78},
{"date":"Dec 27, 2025","bid":108,"win":64,"purchase":49},
{"date":"Dec 26, 2025","bid":120,"win":89,"purchase":65},
{"date":"Dec 25, 2025","bid":94,"win":67,"purchase":53},
{"date":"Dec 24, 2025","bid":70,"win":49,"purchase":40},
{"date":"Dec 23, 2025","bid":92,"win":71,"purchase":52},
{"date":"Dec 22, 2025","bid":105,"win":76,"purchase":53},
{"date":"Dec 21, 2025","bid":135,"win":104,"purchase":86},
{"date":"Dec 20, 2025","bid":109,"win":83,"purchase":64},
{"date":"Dec 19, 2025","bid":102,"win":74,"purchase":51},
{"date":"Dec 18, 2025","bid":120,"win":86,"purchase":70},
{"date":"Dec 17, 2025","bid":101,"win":71,"purchase":55},
{"date":"Dec 16, 2025","bid":122,"win":86,"purchase":60},
{"date":"Dec 15, 2025","bid":127,"win":91,"purchase":73},
{"date":"Dec 14, 2025","bid":138,"win":105,"purchase":86},
{"date":"Dec 13, 2025","bid":127,"win":105,"purchase":77},
{"date":"Dec 12, 2025","bid":86,"win":67,"purchase":54},
{"date":"Dec 11, 2025","bid":102,"win":72,"purchase":55},
{"date":"Dec 10, 2025","bid":151,"win":117,"purchase":85},
{"date":"Dec 9, 2025","bid":135,"win":101,"purchase":66},
{"date":"Dec 8, 2025","bid":121,"win":92,"purchase":69},
{"date":"Dec 7, 2025","bid":133,"win":104,"purchase":80},
{"date":"Dec 6, 2025","bid":130,"win":106,"purchase":79},
{"date":"Dec 5, 2025","bid":145,"win":103,"purchase":76},
{"date":"Dec 4, 2025","bid":138,"win":99,"purchase":75},
{"date":"Dec 3, 2025","bid":112,"win":75,"purchase":61},
{"date":"Dec 2, 2025","bid":104,"win":68,"purchase":53},
{"date":"Dec 1, 2025","bid":119,"win":82,"purchase":66},
{"date":"Nov 30, 2025","bid":132,"win":97,"purchase":76},
{"date":"Nov 29, 2025","bid":110,"win":83,"purchase":58},
{"date":"Nov 28, 2025","bid":149,"win":110,"purchase":90},
{"date":"Nov 27, 2025","bid":103,"win":75,"purchase":55},
{"date":"Nov 26, 2025","bid":115,"win":89,"purchase":66},
{"date":"Nov 25, 2025","bid":105,"win":79,"purchase":64},
{"date":"Nov 24, 2025","bid":107,"win":77,"purchase":59},
{"date":"Nov 23, 2025","bid":145,"win":116,"purchase":83},
{"date":"Nov 22, 2025","bid":100,"win":70,"purchase":51},
{"date":"Nov 21, 2025","bid":109,"win":79,"purchase":62},
{"date":"Nov 20, 2025","bid":122,"win":94,"purchase":74},
{"date":"Nov 19, 2025","bid":121,"win":87,"purchase":66},
{"date":"Nov 18, 2025","bid":135,"win":96,"purchase":75},
{"date":"Nov 17, 2025","bid":146,"win":107,"purchase":89},
{"date":"Nov 16, 2025","bid":163,"win":116,"purchase":95},
{"date":"Nov 15, 2025","bid":117,"win":94,"purchase":72},
{"date":"Nov 14, 2025","bid":123,"win":108,"purchase":78},
{"date":"Nov 13, 2025","bid":162,"win":122,"purchase":95},
{"date":"Nov 12, 2025","bid":131,"win":106,"purchase":81},
{"date":"Nov 11, 2025","bid":112,"win":89,"purchase":76},
{"date":"Nov 10, 2025","bid":134,"win":99,"purchase":76},
{"date":"Nov 9, 2025","bid":125,"win":86,"purchase":71},
{"date":"Nov 8, 2025","bid":135,"win":104,"purchase":69},
{"date":"Nov 7, 2025","bid":114,"win":81,"purchase":62},
{"date":"Nov 6, 2025","bid":125,"win":88,"purchase":59},
{"date":"Nov 5, 2025","bid":116,"win":88,"purchase":69},
{"date":"Nov 4, 2025","bid":128,"win":95,"purchase":68},
{"date":"Nov 3, 2025","bid":115,"win":87,"purchase":75},
{"date":"Nov 2, 2025","bid":107,"win":85,"purchase":66},
{"date":"Nov 1, 2025","bid":108,"win":80,"purchase":62},
{"date":"Oct 31, 2025","bid":113,"win":95,"purchase":74},
{"date":"Oct 30, 2025","bid":125,"win":92,"purchase":66},
{"date":"Oct 29, 2025","bid":123,"win":88,"purchase":66},
{"date":"Oct 28, 2025","bid":134,"win":100,"purchase":77},
{"date":"Oct 27, 2025","bid":132,"win":99,"purchase":79},
{"date":"Oct 26, 2025","bid":141,"win":108,"purchase":81},
{"date":"Oct 25, 2025","bid":126,"win":91,"purchase":76},
{"date":"Oct 24, 2025","bid":126,"win":98,"purchase":71},
{"date":"Oct 23, 2025","bid":106,"win":81,"purchase":62},
{"date":"Oct 22, 2025","bid":117,"win":81,"purchase":65},
{"date":"Oct 21, 2025","bid":93,"win":73,"purchase":65},
{"date":"Oct 20, 2025","bid":100,"win":74,"purchase":56},
{"date":"Oct 19, 2025","bid":136,"win":102,"purchase":77},
{"date":"Oct 18, 2025","bid":109,"win":90,"purchase":67},
{"date":"Oct 17, 2025","bid":116,"win":98,"purchase":78},
{"date":"Oct 16, 2025","bid":100,"win":68,"purchase":57},
{"date":"Oct 15, 2025","bid":120,"win":83,"purchase":70},
{"date":"Oct 14, 2025","bid":102,"win":78,"purchase":55},
{"date":"Oct 13, 2025","bid":106,"win":83,"purchase":67},
{"date":"Oct 12, 2025","bid":116,"win":85,"purchase":66},
{"date":"Oct 11, 2025","bid":138,"win":91,"purchase":67},
{"date":"Oct 10, 2025","bid":92,"win":72,"purchase":59},
{"date":"Oct 9, 2025","bid":111,"win":83,"purchase":72},
{"date":"Oct 8, 2025","bid":119,"win":100,"purchase":77},
{"date":"Oct 7, 2025","bid":109,"win":89,"purchase":65},
{"date":"Oct 6, 2025","bid":125,"win":93,"purchase":71},
{"date":"Oct 5, 2025","bid":147,"win":104,"purchase":88},
{"date":"Oct 4, 2025","bid":157,"win":122,"purchase":104},
{"date":"Oct 3, 2025","bid":135,"win":99,"purchase":69},
{"date":"Oct 2, 2025","bid":96,"win":71,"purchase":53},
{"date":"Oct 1, 2025","bid":110,"win":84,"purchase":62},
{"date":"Sep 30, 2025","bid":134,"win":99,"purchase":73},
{"date":"Sep 29, 2025","bid":120,"win":92,"purchase":71},
{"date":"Sep 28, 2025","bid":129,"win":98,"purchase":78},
{"date":"Sep 27, 2025","bid":148,"win":116,"purchase":96},
{"date":"Sep 26, 2025","bid":99,"win":71,"purchase":59},
{"date":"Sep 25, 2025","bid":101,"win":68,"purchase":52},
{"date":"Sep 24, 2025","bid":126,"win":91,"purchase":72},
{"date":"Sep 23, 2025","bid":146,"win":102,"purchase":79},
{"date":"Sep 22, 2025","bid":140,"win":110,"purchase":83},
{"date":"Sep 21, 2025","bid":135,"win":93,"purchase":75},
{"date":"Sep 20, 2025","bid":122,"win":94,"purchase":69},
{"date":"Sep 19, 2025","bid":135,"win":102,"purchase":82},
{"date":"Sep 18, 2025","bid":117,"win":85,"purchase":73},
{"date":"Sep 17, 2025","bid":116,"win":89,"purchase":75},
{"date":"Sep 16, 2025","bid":103,"win":78,"purchase":62},
{"date":"Sep 15, 2025","bid":160,"win":127,"purchase":104},
{"date":"Sep 14, 2025","bid":156,"win":101,"purchase":80},
{"date":"Sep 13, 2025","bid":125,"win":95,"purchase":82},
{"date":"Sep 12, 2025","bid":129,"win":94,"purchase":69},
{"date":"Sep 11, 2025","bid":142,"win":101,"purchase":82},
{"date":"Sep 10, 2025","bid":123,"win":85,"purchase":66},
{"date":"Sep 9, 2025","bid":107,"win":79,"purchase":61},
{"date":"Sep 8, 2025","bid":128,"win":91,"purchase":69},
{"date":"Sep 7, 2025","bid":167,"win":127,"purchase":98},
{"date":"Sep 6, 2025","bid":126,"win":100,"purchase":82},
{"date":"Sep 5, 2025","bid":133,"win":88,"purchase":75},
{"date":"Sep 4, 2025","bid":149,"win":109,"purchase":84},
{"date":"Sep 3, 2025","bid":126,"win":97,"purchase":70},
{"date":"Sep 2, 2025","bid":120,"win":99,"purchase":66},
{"date":"Sep 1, 2025","bid":146,"win":105,"purchase":83},
{"date":"Aug 31, 2025","bid":152,"win":104,"purchase":81},
{"date":"Aug 30, 2025","bid":130,"win":85,"purchase":59},
{"date":"Aug 29, 2025","bid":115,"win":80,"purchase":59},
{"date":"Aug 28, 2025","bid":139,"win":101,"purchase":70},
{"date":"Aug 27, 2025","bid":149,"win":105,"purchase":86},
{"date":"Aug 26, 2025","bid":105,"win":74,"purchase":62},
{"date":"Aug 25, 2025","bid":149,"win":113,"purchase":88},
{"date":"Aug 24, 2025","bid":151,"win":104,"purchase":76},
{"date":"Aug 23, 2025","bid":117,"win":91,"purchase":71},
{"date":"Aug 22, 2025","bid":110,"win":82,"purchase":63},
{"date":"Aug 21, 2025","bid":122,"win":84,"purchase":71},
{"date":"Aug 20, 2025","bid":148,"win":106,"purchase":86},
{"date":"Aug 19, 2025","bid":114,"win":80,"purchase":62},
{"date":"Aug 18, 2025","bid":128,"win":89,"purchase":70},
{"date":"Aug 17, 2025","bid":155,"win":114,"purchase":92},
{"date":"Aug 16, 2025","bid":163,"win":120,"purchase":98},
{"date":"Aug 15, 2025","bid":155,"win":120,"purchase":97},
{"date":"Aug 14, 2025","bid":161,"win":121,"purchase":94},
{"date":"Aug 13, 2025","bid":167,"win":115,"purchase":88},
{"date":"Aug 12, 2025","bid":164,"win":112,"purchase":85},
{"date":"Aug 11, 2025","bid":165,"win":132,"purchase":105},
{"date":"Aug 10, 2025","bid":184,"win":128,"purchase":97},
{"date":"Aug 9, 2025","bid":172,"win":126,"purchase":102},
{"date":"Aug 8, 2025","bid":197,"win":147,"purchase":110},
{"date":"Aug 7, 2025","bid":275,"win":165,"purchase":116},
{"date":"Aug 6, 2025","bid":243,"win":162,"purchase":114},
{"date":"Aug 5, 2025","bid":148,"win":106,"purchase":72},
{"date":"Aug 4, 2025","bid":155,"win":113,"purchase":94},
{"date":"Aug 3, 2025","bid":159,"win":112,"purchase":79},
{"date":"Aug 2, 2025","bid":155,"win":122,"purchase":93},
{"date":"Aug 1, 2025","bid":107,"win":79,"purchase":53},
{"date":"Jul 31, 2025","bid":144,"win":98,"purchase":67},
{"date":"Jul 30, 2025","bid":127,"win":88,"purchase":61},
{"date":"Jul 29, 2025","bid":143,"win":97,"purchase":73},
{"date":"Jul 28, 2025","bid":114,"win":87,"purchase":69},
{"date":"Jul 27, 2025","bid":156,"win":113,"purchase":81},
{"date":"Jul 26, 2025","bid":149,"win":106,"purchase":77},
{"date":"Jul 25, 2025","bid":138,"win":95,"purchase":76},
{"date":"Jul 24, 2025","bid":116,"win":87,"purchase":69},
{"date":"Jul 23, 2025","bid":134,"win":93,"purchase":71},
{"date":"Jul 22, 2025","bid":124,"win":81,"purchase":63},
{"date":"Jul 21, 2025","bid":119,"win":89,"purchase":61},
{"date":"Jul 20, 2025","bid":145,"win":101,"purchase":79},
{"date":"Jul 19, 2025","bid":144,"win":106,"purchase":75},
{"date":"Jul 18, 2025","bid":145,"win":109,"purchase":89},
{"date":"Jul 17, 2025","bid":132,"win":99,"purchase":78},
{"date":"Jul 16, 2025","bid":169,"win":126,"purchase":93},
{"date":"Jul 15, 2025","bid":152,"win":116,"purchase":89},
{"date":"Jul 14, 2025","bid":164,"win":109,"purchase":81},
{"date":"Jul 13, 2025","bid":174,"win":135,"purchase":103},
{"date":"Jul 12, 2025","bid":196,"win":144,"purchase":112},
{"date":"Jul 11, 2025","bid":167,"win":117,"purchase":86},
{"date":"Jul 10, 2025","bid":170,"win":120,"purchase":97},
{"date":"Jul 9, 2025","bid":117,"win":82,"purchase":63},
{"date":"Jul 8, 2025","bid":124,"win":91,"purchase":74},
{"date":"Jul 7, 2025","bid":96,"win":78,"purchase":61},
{"date":"Jul 6, 2025","bid":143,"win":105,"purchase":73},
{"date":"Jul 5, 2025","bid":134,"win":93,"purchase":69},
{"date":"Jul 4, 2025","bid":133,"win":95,"purchase":75},
{"date":"Jul 3, 2025","bid":124,"win":89,"purchase":66},
{"date":"Jul 2, 2025","bid":127,"win":102,"purchase":77},
{"date":"Jul 1, 2025","bid":140,"win":111,"purchase":95},
{"date":"Jun 30, 2025","bid":119,"win":82,"purchase":66},
{"date":"Jun 29, 2025","bid":150,"win":113,"purchase":88},
{"date":"Jun 28, 2025","bid":134,"win":107,"purchase":83},
{"date":"Jun 27, 2025","bid":124,"win":85,"purchase":69},
{"date":"Jun 26, 2025","bid":122,"win":97,"purchase":68},
{"date":"Jun 25, 2025","bid":111,"win":85,"purchase":69},
{"date":"Jun 24, 2025","bid":124,"win":86,"purchase":73},
{"date":"Jun 23, 2025","bid":111,"win":88,"purchase":72},
{"date":"Jun 22, 2025","bid":134,"win":82,"purchase":60},
{"date":"Jun 21, 2025","bid":126,"win":91,"purchase":71},
{"date":"Jun 20, 2025","bid":119,"win":92,"purchase":75},
{"date":"Jun 19, 2025","bid":149,"win":107,"purchase":84},
{"date":"Jun 18, 2025","bid":115,"win":104,"purchase":87},
{"date":"Jun 17, 2025","bid":123,"win":99,"purchase":75},
{"date":"Jun 16, 2025","bid":131,"win":96,"purchase":76},
{"date":"Jun 15, 2025","bid":129,"win":100,"purchase":83},
{"date":"Jun 14, 2025","bid":122,"win":96,"purchase":79},
{"date":"Jun 13, 2025","bid":123,"win":92,"purchase":69},
{"date":"Jun 12, 2025","bid":123,"win":94,"purchase":65},
{"date":"Jun 11, 2025","bid":134,"win":96,"purchase":73},
{"date":"Jun 10, 2025","bid":128,"win":88,"purchase":69},
{"date":"Jun 9, 2025","bid":130,"win":98,"purchase":69},
{"date":"Jun 8, 2025","bid":127,"win":96,"purchase":81},
{"date":"Jun 7, 2025","bid":138,"win":106,"purchase":84},
{"date":"Jun 6, 2025","bid":114,"win":89,"purchase":72},
{"date":"Jun 5, 2025","bid":105,"win":79,"purchase":63},
{"date":"Jun 4, 2025","bid":141,"win":101,"purchase":72},
{"date":"Jun 3, 2025","bid":108,"win":78,"purchase":62},
{"date":"Jun 2, 2025","bid":126,"win":104,"purchase":90},
{"date":"Jun 1, 2025","bid":145,"win":108,"purchase":87},
{"date":"May 31, 2025","bid":169,"win":135,"purchase":101},
{"date":"May 30, 2025","bid":125,"win":93,"purchase":75},
{"date":"May 29, 2025","bid":132,"win":105,"purchase":81},
{"date":"May 28, 2025","bid":135,"win":111,"purchase":83},
{"date":"May 27, 2025","bid":162,"win":124,"purchase":96},
{"date":"May 26, 2025","bid":159,"win":120,"purchase":96},
{"date":"May 25, 2025","bid":136,"win":102,"purchase":71},
{"date":"May 24, 2025","bid":149,"win":117,"purchase":97},
{"date":"May 23, 2025","bid":169,"win":116,"purchase":90},
{"date":"May 22, 2025","bid":166,"win":122,"purchase":97},
{"date":"May 21, 2025","bid":98,"win":77,"purchase":61},
{"date":"May 20, 2025","bid":95,"win":72,"purchase":52},
{"date":"May 19, 2025","bid":80,"win":59,"purchase":48},
{"date":"May 18, 2025","bid":80,"win":59,"purchase":49},
{"date":"May 17, 2025","bid":91,"win":66,"purchase":52},
{"date":"May 16, 2025","bid":80,"win":55,"purchase":42},
{"date":"May 15, 2025","bid":84,"win":72,"purchase":59},
{"date":"May 14, 2025","bid":50,"win":41,"purchase":34},
{"date":"May 13, 2025","bid":56,"win":45,"purchase":39},
{"date":"May 12, 2025","bid":43,"win":36,"purchase":25},
{"date":"May 11, 2025","bid":51,"win":41,"purchase":34},
{"date":"May 10, 2025","bid":57,"win":38,"purchase":31},
{"date":"May 9, 2025","bid":43,"win":36,"purchase":28},
{"date":"May 8, 2025","bid":42,"win":36,"purchase":30},
{"date":"May 7, 2025","bid":38,"win":30,"purchase":25},
{"date":"May 6, 2025","bid":52,"win":46,"purchase":37},
{"date":"May 5, 2025","bid":35,"win":29,"purchase":24},
{"date":"May 4, 2025","bid":39,"win":35,"purchase":31},
{"date":"May 3, 2025","bid":49,"win":43,"purchase":35},
{"date":"May 2, 2025","bid":35,"win":30,"purchase":21},
{"date":"May 1, 2025","bid":47,"win":39,"purchase":32},
{"date":"Apr 30, 2025","bid":49,"win":42,"purchase":28},
{"date":"Apr 29, 2025","bid":56,"win":41,"purchase":29},
{"date":"Apr 28, 2025","bid":71,"win":55,"purchase":43},
{"date":"Apr 27, 2025","bid":74,"win":56,"purchase":42},
{"date":"Apr 26, 2025","bid":63,"win":51,"purchase":42},
{"date":"Apr 25, 2025","bid":53,"win":47,"purchase":40},
{"date":"Apr 24, 2025","bid":39,"win":30,"purchase":23},
{"date":"Apr 23, 2025","bid":41,"win":31,"purchase":27},
{"date":"Apr 22, 2025","bid":50,"win":36,"purchase":29},
{"date":"Apr 21, 2025","bid":44,"win":36,"purchase":25},
{"date":"Apr 20, 2025","bid":44,"win":37,"purchase":29},
{"date":"Apr 19, 2025","bid":44,"win":35,"purchase":32},
{"date":"Apr 18, 2025","bid":46,"win":38,"purchase":31},
{"date":"Apr 17, 2025","bid":38,"win":35,"purchase":26},
{"date":"Apr 16, 2025","bid":39,"win":32,"purchase":29},
{"date":"Apr 15, 2025","bid":49,"win":38,"purchase":35},
{"date":"Apr 14, 2025","bid":34,"win":27,"purchase":22},
{"date":"Apr 13, 2025","bid":33,"win":25,"purchase":17},
{"date":"Apr 12, 2025","bid":60,"win":48,"purchase":36},
{"date":"Apr 11, 2025","bid":54,"win":44,"purchase":38},
{"date":"Apr 10, 2025","bid":56,"win":46,"purchase":35},
{"date":"Apr 9, 2025","bid":88,"win":65,"purchase":47},
{"date":"Apr 8, 2025","bid":58,"win":46,"purchase":34},
{"date":"Apr 7, 2025","bid":47,"win":37,"purchase":34},
{"date":"Apr 6, 2025","bid":64,"win":52,"purchase":42},
{"date":"Apr 5, 2025","bid":70,"win":59,"purchase":46},
{"date":"Apr 4, 2025","bid":56,"win":50,"purchase":43},
{"date":"Apr 3, 2025","bid":70,"win":61,"purchase":52},
{"date":"Apr 2, 2025","bid":8100,"win":7213,"purchase":6461, "isLaunch": true},
{"date":"Apr 1, 2025","bid":30,"win":25,"purchase":22},
{"date":"Mar 31, 2025","bid":14,"win":11,"purchase":7},
{"date":"Mar 30, 2025","bid":12,"win":9,"purchase":5},
{"date":"Mar 29, 2025","bid":11,"win":8,"purchase":8},
{"date":"Mar 28, 2025","bid":24,"win":21,"purchase":17},
{"date":"Mar 27, 2025","bid":7,"win":4,"purchase":1},
{"date":"Mar 26, 2025","bid":3,"win":1,"purchase":1},
{"date":"Mar 25, 2025","bid":8,"win":5,"purchase":4},
{"date":"Mar 24, 2025","bid":9,"win":3,"purchase":2},
{"date":"Mar 23, 2025","bid":8,"win":5,"purchase":2},
{"date":"Mar 22, 2025","bid":4,"win":2,"purchase":1},
{"date":"Mar 21, 2025","bid":4,"win":2,"purchase":2},
{"date":"Mar 20, 2025","bid":11,"win":10,"purchase":7},
{"date":"Mar 19, 2025","bid":10,"win":7,"purchase":7},
{"date":"Mar 18, 2025","bid":8,"win":6,"purchase":3},
{"date":"Mar 17, 2025","bid":4,"win":1,"purchase":0},
{"date":"Mar 16, 2025","bid":5,"win":3,"purchase":1},
{"date":"Mar 15, 2025","bid":14,"win":9,"purchase":3},
{"date":"Mar 14, 2025","bid":4,"win":1,"purchase":0},
{"date":"Mar 13, 2025","bid":10,"win":5,"purchase":3},
{"date":"Mar 12, 2025","bid":5,"win":3,"purchase":2},
{"date":"Mar 11, 2025","bid":3,"win":3,"purchase":3},
{"date":"Mar 10, 2025","bid":2,"win":2,"purchase":1},
{"date":"Mar 9, 2025","bid":12,"win":10,"purchase":8},
{"date":"Mar 8, 2025","bid":8,"win":6,"purchase":4},
{"date":"Mar 7, 2025","bid":9,"win":5,"purchase":2},
{"date":"Mar 6, 2025","bid":8,"win":3,"purchase":2},
{"date":"Mar 5, 2025","bid":3,"win":2,"purchase":2},
{"date":"Mar 4, 2025","bid":7,"win":4,"purchase":4},
{"date":"Mar 3, 2025","bid":5,"win":4,"purchase":1},
{"date":"Mar 2, 2025","bid":8,"win":6,"purchase":2},
{"date":"Mar 1, 2025","bid":5,"win":3,"purchase":0},
].reverse();

// Parse dates
const parseDate = (str) => new Date(str + ", 12:00:00");

// Get ISO week number
const getWeekKey = (d) => {
  const date = new Date(d);
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const getMonthKey = (d) => {
  const date = new Date(d);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getMonthSort = (d) => {
  const date = new Date(d);
  return date.getFullYear() * 100 + date.getMonth();
};

// Aggregate data
const aggregateData = (data, mode) => {
  // Exclude the Apr 2 launch event from trend data
  const filtered = data.filter(d => !d.isLaunch);

  if (mode === 'weekly') {
    const groups = {};
    filtered.forEach(d => {
      const dt = parseDate(d.date);
      const key = getWeekKey(dt);
      if (!groups[key]) groups[key] = { bid: 0, win: 0, purchase: 0, count: 0, firstDate: dt, label: key };
      groups[key].bid += d.bid;
      groups[key].win += d.win;
      groups[key].purchase += d.purchase;
      groups[key].count += 1;
      if (dt < groups[key].firstDate) groups[key].firstDate = dt;
    });
    return Object.values(groups)
      .sort((a, b) => a.firstDate - b.firstDate)
      .map(g => {
        const m = g.firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          label: m,
          bid: g.bid,
          win: g.win,
          purchase: g.purchase,
          avgBid: Math.round(g.bid / g.count),
          avgWin: Math.round(g.win / g.count),
          avgPurchase: Math.round(g.purchase / g.count),
        };
      });
  } else {
    const groups = {};
    filtered.forEach(d => {
      const dt = parseDate(d.date);
      const key = getMonthKey(d.date);
      const sort = getMonthSort(dt);
      if (!groups[key]) groups[key] = { bid: 0, win: 0, purchase: 0, count: 0, sort, label: key };
      groups[key].bid += d.bid;
      groups[key].win += d.win;
      groups[key].purchase += d.purchase;
      groups[key].count += 1;
    });
    return Object.values(groups)
      .sort((a, b) => a.sort - b.sort)
      .map(g => ({
        label: g.label,
        bid: g.bid,
        win: g.win,
        purchase: g.purchase,
        avgBid: Math.round(g.bid / g.count),
        avgWin: Math.round(g.win / g.count),
        avgPurchase: Math.round(g.purchase / g.count),
      }));
  }
};

// Conversion rates by month
const getConversionData = (data) => {
  const filtered = data.filter(d => !d.isLaunch);
  const groups = {};
  filtered.forEach(d => {
    const dt = parseDate(d.date);
    const key = getMonthKey(d.date);
    const sort = getMonthSort(dt);
    if (!groups[key]) groups[key] = { bid: 0, win: 0, purchase: 0, sort, label: key };
    groups[key].bid += d.bid;
    groups[key].win += d.win;
    groups[key].purchase += d.purchase;
  });
  return Object.values(groups)
    .sort((a, b) => a.sort - b.sort)
    .map(g => ({
      label: g.label,
      bidToWin: Math.round((g.win / g.bid) * 1000) / 10,
      winToPurchase: Math.round((g.purchase / g.win) * 1000) / 10,
      bidToPurchase: Math.round((g.purchase / g.bid) * 1000) / 10,
    }));
};

const COLORS = {
  bg: '#0a0f1a',
  card: '#111827',
  cardBorder: '#1e293b',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  bid: '#38bdf8',
  bidGlow: 'rgba(56, 189, 248, 0.15)',
  win: '#a78bfa',
  winGlow: 'rgba(167, 139, 250, 0.15)',
  purchase: '#34d399',
  purchaseGlow: 'rgba(52, 211, 153, 0.15)',
  accent: '#f59e0b',
  gridLine: '#1e293b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: 10,
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: COLORS.textMuted, fontSize: 12, margin: '0 0 8px', fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 14, margin: '4px 0', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          {p.name}: {typeof p.value === 'number' && p.value < 100 ? `${p.value}%` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, color, glowColor }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.card} 0%, ${glowColor} 100%)`,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 16,
    padding: '24px 28px',
    flex: 1,
    minWidth: 180,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -20, right: -20, width: 80, height: 80,
      borderRadius: '50%', background: color, opacity: 0.07,
    }} />
    <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
    <p style={{ color: COLORS.text, fontSize: 36, fontWeight: 700, margin: '6px 0 2px', fontFamily: "'Space Mono', monospace'" }}>{value}</p>
    <p style={{ color, fontSize: 13, margin: 0, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>
  </div>
);

const Toggle = ({ options, value, onChange }) => (
  <div style={{
    display: 'inline-flex', background: '#1e293b', borderRadius: 10, padding: 3,
    border: '1px solid #334155',
  }}>
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        style={{
          padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s ease',
          background: value === opt.value ? '#334155' : 'transparent',
          color: value === opt.value ? COLORS.text : COLORS.textDim,
        }}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// Animated counter hook
function useAnimatedCount(target, duration = 2000, startDelay = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return count;
}

// Single animated metric tile
const AnimatedMetric = ({ label, value, prefix = '', suffix = '', delay = 0, color, icon }) => {
  const numericVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const animVal = useAnimatedCount(numericVal, 2200, delay);
  const formatted = numericVal >= 1000 ? animVal.toLocaleString() : animVal;

  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 18,
      padding: '32px 28px 28px', position: 'relative', overflow: 'hidden',
      flex: '1 1 260px', minWidth: 220,
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 100, height: 100,
        borderRadius: '50%', background: color, opacity: 0.06,
      }} />
      <div style={{
        position: 'absolute', bottom: -20, left: -20, width: 60, height: 60,
        borderRadius: '50%', background: color, opacity: 0.04,
      }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <p style={{
        color: COLORS.textMuted, fontSize: 12, margin: '0 0 6px',
        letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
      }}>{label}</p>
      <p style={{
        color, fontSize: 40, fontWeight: 700, margin: 0,
        fontFamily: "'Space Mono', monospace", letterSpacing: '-0.02em', lineHeight: 1.1,
      }}>
        {prefix}{formatted}{suffix}
      </p>
    </div>
  );
};

// Overview tab component
const OverviewTab = ({ onNavigate }) => (
  <div>
    {/* Hero */}
    <div style={{
      textAlign: 'center', padding: '40px 20px 48px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.08) 0%, rgba(167,139,250,0.05) 40%, transparent 70%)',
      borderRadius: 20, marginBottom: 40, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)',
      }} />
      <p style={{
        fontSize: 13, color: COLORS.bid, margin: '0 0 12px',
        letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
      }}>Year in Review</p>
      <h2 style={{ fontSize: 38, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        LOA by the Numbers
      </h2>
      <p style={{
        color: COLORS.textMuted, fontSize: 15, margin: '0 auto', maxWidth: 500, lineHeight: 1.6,
      }}>
        Since onboarding in March 2025, LOA has seen extraordinary growth across every key metric. These are the results of a world-class marketing partnership.
      </p>
    </div>

    {/* Primary metrics — big row */}
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 20 }}>
      <AnimatedMetric label="Customers" value={30521} prefix="" icon="&#128101;" delay={0} color={COLORS.bid} />
      <AnimatedMetric label="Net Purchase Volume" value={19455595} prefix="$" icon="&#128176;" delay={150} color={COLORS.purchase} />
      <AnimatedMetric label="Avg Lifetime Value" value={1138} prefix="$" icon="&#128142;" delay={300} color={COLORS.win} />
    </div>

    {/* Secondary metrics */}
    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 48 }}>
      <AnimatedMetric label="Total Bids" value={3927262} prefix="" icon="&#128200;" delay={450} color={COLORS.bid} />
      <AnimatedMetric label="Total Wins" value={2389601} prefix="" icon="&#127942;" delay={600} color={COLORS.win} />
      <AnimatedMetric label="Avg Purchase Value" value={75} prefix="$" icon="&#128717;" delay={750} color={COLORS.purchase} />
    </div>

    {/* CTA cards to other tabs */}
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
      <button
        onClick={() => onNavigate('funnel')}
        style={{
          flex: '1 1 280px', background: 'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.02) 100%)',
          border: `1px solid rgba(56,189,248,0.2)`, borderRadius: 14, padding: '24px 28px',
          cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'}
      >
        <p style={{ fontSize: 20, margin: '0 0 6px', fontWeight: 700, color: COLORS.text }}>Funnel Performance &rarr;</p>
        <p style={{ fontSize: 13, margin: 0, color: COLORS.textMuted }}>Dive into bidder, win, and purchase growth trends with interactive charts</p>
      </button>
      <button
        onClick={() => onNavigate('marketing')}
        style={{
          flex: '1 1 280px', background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.02) 100%)',
          border: `1px solid rgba(167,139,250,0.2)`, borderRadius: 14, padding: '24px 28px',
          cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'}
      >
        <p style={{ fontSize: 20, margin: '0 0 6px', fontWeight: 700, color: COLORS.text }}>Marketing Updates &rarr;</p>
        <p style={{ fontSize: 13, margin: 0, color: COLORS.textMuted }}>See the Klaviyo engine, acquisition strategy, and what&rsquo;s coming next</p>
      </button>
    </div>

    <p style={{ color: COLORS.textDim, fontSize: 12, textAlign: 'center', margin: '16px 0 8px' }}>
      All figures as of March 2026 &nbsp;·&nbsp; Customers defined as users with a confirmed purchase/sale receipt
    </p>
  </div>
);

export default function FunnelDashboard() {
  const [timeframe, setTimeframe] = useState('monthly');
  const [metric, setMetric] = useState('total');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const chartData = useMemo(() => aggregateData(RAW_DATA, timeframe), [timeframe]);
  const conversionData = useMemo(() => getConversionData(RAW_DATA), []);

  // Monthly aggregated data for stat card lookups
  const monthlyData = useMemo(() => aggregateData(RAW_DATA, 'monthly'), []);

  // April 2025 baseline (excluding launch)
  const aprilBaseline = useMemo(() => {
    const apr = monthlyData.find(m => m.label === 'Apr 2025');
    return apr ? { avgBid: apr.avgBid, avgWin: apr.avgWin, avgPurchase: apr.avgPurchase } : { avgBid: 1, avgWin: 1, avgPurchase: 1 };
  }, [monthlyData]);

  // Determine selected period — default to latest full month
  const selectedData = useMemo(() => {
    if (selectedLabel) {
      // Find in current timeframe's chart data
      const match = chartData.find(d => d.label === selectedLabel);
      if (match) return { ...match, displayLabel: selectedLabel };
    }
    // Default: latest monthly data
    const latest = monthlyData[monthlyData.length - 1];
    return latest ? { ...latest, displayLabel: latest.label } : null;
  }, [selectedLabel, chartData, monthlyData]);

  // Stat card values
  const statBid = selectedData ? selectedData.bid : 0;
  const statWin = selectedData ? selectedData.win : 0;
  const statPurchase = selectedData ? selectedData.purchase : 0;
  const statAvgBid = selectedData ? selectedData.avgBid : 0;
  const statAvgWin = selectedData ? selectedData.avgWin : 0;
  const statAvgPurchase = selectedData ? selectedData.avgPurchase : 0;

  const bidGrowth = aprilBaseline.avgBid ? Math.round(((statAvgBid - aprilBaseline.avgBid) / aprilBaseline.avgBid) * 100) : 0;
  const winGrowth = aprilBaseline.avgWin ? Math.round(((statAvgWin - aprilBaseline.avgWin) / aprilBaseline.avgWin) * 100) : 0;
  const purchaseGrowth = aprilBaseline.avgPurchase ? Math.round(((statAvgPurchase - aprilBaseline.avgPurchase) / aprilBaseline.avgPurchase) * 100) : 0;

  const periodLabel = selectedData ? selectedData.displayLabel : '';

  // Reset selection when timeframe changes
  const handleTimeframeChange = (val) => {
    setSelectedLabel(null);
    setTimeframe(val);
  };

  // Chart click handler
  const handleChartClick = (data) => {
    if (data && data.activeLabel) {
      setSelectedLabel(data.activeLabel);
    }
  };

  const valKey = metric === 'avg' ? 'avg' : '';

  return (
    <div style={{
      background: COLORS.bg, minHeight: '100vh', padding: '32px 28px',
      fontFamily: "'DM Sans', sans-serif", color: COLORS.text,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.bid }} />
          <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>LOA Partner Dashboard</p>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 700, margin: '8px 0 6px', letterSpacing: '-0.02em' }}>
          Lots of Auctions — Growth &amp; Strategy
        </h1>
        <p style={{ color: COLORS.textDim, fontSize: 15, margin: '0 0 24px' }}>
          March 2025 — March 2026 &nbsp;·&nbsp; Onboarded late March 2025
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${COLORS.cardBorder}`, marginBottom: 32 }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'funnel', label: 'Funnel Performance' },
            { key: 'marketing', label: 'Marketing Updates' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 28px', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                background: 'transparent',
                color: activeTab === tab.key ? COLORS.text : COLORS.textDim,
                borderBottom: activeTab === tab.key ? `2px solid ${COLORS.bid}` : '2px solid transparent',
                transition: 'all 0.2s ease',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}

      {/* ============ MARKETING TAB ============ */}
      {activeTab === 'marketing' && (
        <div>
          {/* Hero banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(167,139,250,0.1) 50%, rgba(52,211,153,0.08) 100%)',
            border: `1px solid rgba(56,189,248,0.2)`,
            borderRadius: 18, padding: '36px 40px', marginBottom: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(167,139,250,0.06)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(52,211,153,0.05)' }} />
            <p style={{ fontSize: 13, color: COLORS.bid, margin: '0 0 8px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>What&rsquo;s New</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              A New Era of Marketing Intelligence for LOA
            </h2>
            <p style={{ color: COLORS.textMuted, fontSize: 15, margin: 0, maxWidth: 700, lineHeight: 1.7 }}>
              We&rsquo;ve deployed a comprehensive, multi-channel marketing engine purpose-built for Lots of Auctions — from lifecycle automation to acquisition campaigns and buyer experience upgrades. Here&rsquo;s everything we&rsquo;ve shipped.
            </p>
          </div>

          {/* Section: Klaviyo */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>&#9993;</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Klaviyo Marketing Engine</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: '2px 0 0' }}>Lifecycle &amp; retention automation — now live</p>
              </div>
            </div>

            <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.75, margin: '0 0 24px', maxWidth: 800 }}>
              Klaviyo has been a <span style={{ color: COLORS.text, fontWeight: 600 }}>massive unlock</span> for LOA&rsquo;s marketing capabilities. We now have the power to target specific markets and buildings with precision-crafted review, re-engagement, and update strategies — turning every customer interaction into a growth opportunity.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Flow Card: Reviews */}
              <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
                padding: '24px 24px 20px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#11088;</span>
                  <p style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live</p>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Google Review Flow</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  Targets high-value customers with <span style={{ color: COLORS.text, fontWeight: 500 }}>5+ wins</span> and encourages them to leave a positive Google review — directly building LOA&rsquo;s online reputation and trust with new buyers.
                </p>
              </div>

              {/* Flow Card: Re-engagement */}
              <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
                padding: '24px 24px 20px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#128260;</span>
                  <p style={{ fontSize: 11, color: COLORS.bid, fontWeight: 700, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Revamped</p>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Re-Engagement Flow</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  Automatically re-engages bidders who have been inactive for <span style={{ color: COLORS.text, fontWeight: 500 }}>14+ days</span> — winning back lapsed users before they churn with personalized, timely outreach.
                </p>
              </div>

              {/* Flow Card: Second Chance + Daily */}
              <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
                padding: '24px 24px 20px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #34d399, #10b981)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#128142;</span>
                  <p style={{ fontSize: 11, color: COLORS.purchase, fontWeight: 700, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>High Performer</p>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Second Chance &amp; Daily Recs</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  LOA items are now featured in <span style={{ color: COLORS.text, fontWeight: 500 }}>second chance offers</span> and a daily recommended items email — one of our highest-performing email products driving consistent daily engagement.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: COLORS.cardBorder, margin: '8px 0 40px' }} />

          {/* Section: Acquisition */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>&#127775;</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Acquisition &amp; Creative</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: '2px 0 0' }}>Paid media &amp; influencer strategy</p>
              </div>
            </div>

            <div style={{
              background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
              padding: '28px 28px', display: 'flex', gap: 32, flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1 1 300px' }}>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', color: COLORS.bid }}>Dallas Market — High Budget Maintained</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                  We&rsquo;ve sustained a strong paid media presence in the Dallas market with continually refreshed ad creatives. A growing roster of <span style={{ color: COLORS.text, fontWeight: 500 }}>influencer partners</span> keeps the content fresh and authentic — driving awareness and new registrations at scale.
                </p>
              </div>
              <div style={{ flex: '0 0 1px', background: COLORS.cardBorder, alignSelf: 'stretch' }} />
              <div style={{ flex: '1 1 300px' }}>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', color: COLORS.win }}>Creative Refresh Cycle</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                  Ad fatigue is never a problem. We continuously rotate creatives through influencer-generated content, new ad formats, and market-specific messaging to keep performance high and cost-per-acquisition low.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: COLORS.cardBorder, margin: '8px 0 40px' }} />

          {/* Section: Buyer Experience */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>&#128269;</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Buyer Experience</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: '2px 0 0' }}>Search, discovery &amp; personalization</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
                padding: '24px 24px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#128161;</span>
                  <p style={{ fontSize: 11, color: COLORS.purchase, fontWeight: 700, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Launched</p>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Spotlight Page</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  A dedicated Spotlight page is now live, improving how buyers search, discover, and save LOA items — reducing friction and increasing time on site.
                </p>
              </div>

              <div style={{
                background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
                padding: '24px 24px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>&#129302;</span>
                  <p style={{ fontSize: 11, color: COLORS.win, fontWeight: 700, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Partnership</p>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>AI/ML Search &amp; Recommendations</h4>
                <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  We&rsquo;ve partnered with an AI/ML company to bring intelligent search and personalized recommendations to the buyer website — making it easier than ever for buyers to find exactly what they want.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: COLORS.cardBorder, margin: '8px 0 40px' }} />

          {/* Coming Soon */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>&#128640;</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Coming Soon</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: '2px 0 0' }}>What&rsquo;s next on the roadmap</p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)',
              border: `1px dashed rgba(245,158,11,0.35)`,
              borderRadius: 14, padding: '28px 28px',
            }}>
              <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', color: COLORS.accent }}>First-of-Its-Kind Recommendation Engine</h4>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.75, margin: 0, maxWidth: 700 }}>
                A brand-new recommendation engine will connect directly to Klaviyo — surfacing available items that match each user&rsquo;s interests and bid history. This is a <span style={{ color: COLORS.accent, fontWeight: 600 }}>first-of-its-kind integration</span> that will drive highly personalized, automated outreach at scale. No one else in the space is doing this.
              </p>
            </div>
          </div>

          <p style={{ color: COLORS.textDim, fontSize: 12, textAlign: 'center', margin: '24px 0 8px' }}>
            LOA Marketing Strategy &nbsp;·&nbsp; March 2026
          </p>
        </div>
      )}

      {/* ============ FUNNEL TAB ============ */}
      {activeTab === 'funnel' && (
        <div>
        {/* Launch callout */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.02) 100%)',
          border: `1px solid rgba(245,158,11,0.25)`,
          borderRadius: 14, padding: '16px 24px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 22 }}>&#9889;</div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.accent }}>Launch Migration — April 2, 2025</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: COLORS.textMuted }}>
              8,100 bidders · 7,213 wins · 6,461 purchases migrated on day one. This event is excluded from trend lines below.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: COLORS.text }}>
            {periodLabel}
          </p>
          <p style={{ fontSize: 12, margin: 0, color: COLORS.textDim }}>
            Click any point on the chart to update
          </p>
          {selectedLabel && (
            <button onClick={() => setSelectedLabel(null)} style={{
              background: 'transparent', border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6,
              color: COLORS.textDim, fontSize: 11, padding: '3px 10px', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}>Reset</button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <StatCard label="Bidders" value={statBid.toLocaleString()} sub={`${bidGrowth >= 0 ? '+' : ''}${bidGrowth}% vs Apr '25 (daily avg)`} color={COLORS.bid} glowColor={COLORS.bidGlow} />
          <StatCard label="Wins" value={statWin.toLocaleString()} sub={`${winGrowth >= 0 ? '+' : ''}${winGrowth}% vs Apr '25 (daily avg)`} color={COLORS.win} glowColor={COLORS.winGlow} />
          <StatCard label="Purchases" value={statPurchase.toLocaleString()} sub={`${purchaseGrowth >= 0 ? '+' : ''}${purchaseGrowth}% vs Apr '25 (daily avg)`} color={COLORS.purchase} glowColor={COLORS.purchaseGlow} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Funnel Volume</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <Toggle
              options={[{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]}
              value={timeframe}
              onChange={handleTimeframeChange}
            />
            <Toggle
              options={[{ label: 'Total', value: 'total' }, { label: 'Daily Avg', value: 'avg' }]}
              value={metric}
              onChange={setMetric}
            />
          </div>
        </div>

        {/* Main Chart */}
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 16, padding: '24px 16px 16px', marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }} onClick={handleChartClick} style={{ cursor: 'pointer' }}>
              <defs>
                <linearGradient id="gradBid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.bid} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.bid} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradWin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.win} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.win} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPurchase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.purchase} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.purchase} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLine} />
              <XAxis dataKey="label" tick={{ fill: COLORS.textDim, fontSize: 11 }} tickLine={false} axisLine={{ stroke: COLORS.gridLine }} interval={timeframe === 'weekly' ? 3 : 0} angle={timeframe === 'weekly' ? -30 : 0} textAnchor={timeframe === 'weekly' ? 'end' : 'middle'} height={50} />
              <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={metric === 'avg' ? 'avgBid' : 'bid'} name="Bidders" stroke={COLORS.bid} fill="url(#gradBid)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: COLORS.bid, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Area type="monotone" dataKey={metric === 'avg' ? 'avgWin' : 'win'} name="Wins" stroke={COLORS.win} fill="url(#gradWin)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: COLORS.win, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Area type="monotone" dataKey={metric === 'avg' ? 'avgPurchase' : 'purchase'} name="Purchases" stroke={COLORS.purchase} fill="url(#gradPurchase)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: COLORS.purchase, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", paddingTop: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion rates */}
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Conversion Rates by Month</h2>
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 16, padding: '24px 16px 16px', marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLine} />
              <XAxis dataKey="label" tick={{ fill: COLORS.textDim, fontSize: 11 }} tickLine={false} axisLine={{ stroke: COLORS.gridLine }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="bidToWin" name="Bid → Win %" stroke={COLORS.win} strokeWidth={2.5} dot={{ fill: COLORS.win, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Line type="monotone" dataKey="winToPurchase" name="Win → Purchase %" stroke={COLORS.purchase} strokeWidth={2.5} dot={{ fill: COLORS.purchase, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Line type="monotone" dataKey="bidToPurchase" name="Bid → Purchase %" stroke={COLORS.accent} strokeWidth={2} strokeDasharray="6 3" dot={{ fill: COLORS.accent, r: 3, stroke: COLORS.bg, strokeWidth: 2 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", paddingTop: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly breakdown table */}
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Monthly Summary</h2>
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 16, overflow: 'hidden', marginBottom: 32,
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                  {['Month', 'Bidders', 'Wins', 'Purchases', 'Bid→Win', 'Win→Purch', 'Bid→Purch'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: h === 'Month' ? 'left' : 'right', color: COLORS.textMuted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aggregateData(RAW_DATA, 'monthly').map((row, i) => {
                  const bw = row.bid ? Math.round((row.win / row.bid) * 1000) / 10 : 0;
                  const wp = row.win ? Math.round((row.purchase / row.win) * 1000) / 10 : 0;
                  const bp = row.bid ? Math.round((row.purchase / row.bid) * 1000) / 10 : 0;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.cardBorder}`, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 18px', fontWeight: 600 }}>{row.label}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.bid, fontFamily: "'Space Mono', monospace" }}>{row.bid.toLocaleString()}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.win, fontFamily: "'Space Mono', monospace" }}>{row.win.toLocaleString()}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.purchase, fontFamily: "'Space Mono', monospace" }}>{row.purchase.toLocaleString()}</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.textMuted }}>{bw}%</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.textMuted }}>{wp}%</td>
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: COLORS.textMuted }}>{bp}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ color: COLORS.textDim, fontSize: 12, textAlign: 'center', margin: '24px 0 8px' }}>
          Data as of March 1, 2026 &nbsp;·&nbsp; April 2 launch migration excluded from trend analysis
        </p>
        </div>
      )}
      </div>
    </div>
  );
}
