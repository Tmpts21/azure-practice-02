const condition = 
{
    inputTextField: 'trouble_text', 
    sels: [
            {
                id: 1,
                name: 'factory', 
                text: '工場', 
                default: '--', 
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 2,
                name: 'process',
                text: '工程',
                default: '成型', 
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 3,
                name: 'block',
                text: '区分',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 4,
                name: 'type',
                text: '号機',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 5,
                name: 'facility',
                text: '設備',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 6,
                name: 'apparatus',
                text: '装置',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 7,
                name: 'point',
                text: '部位',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            }
        ]
}
const condition2 = 
{
    sels: [
            {
                id: 1,
                name: 'part1',
                text: '故障部品1',
                default: '電気部品',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 2,
                name: 'part2',
                text: '故障部品2',
                default: '機械装置関係部品',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 3,
                name: 'part3',
                text: '故障部品3',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            },
            {
                id: 4,
                name: 'part4',
                text: '故障部品4',
                default: '--',
                options: [
                    {
                        name: "--",
                    }
                ]
            }
        ]
}
const condition3 = 
{
    sels: [
            {
                id: 1,
                name: 'special_type',     // field name
                text: '専門区分',       // select item title
                default: '機械',
                options: [
                    {
                        name: "--",
                    }
                ]
            }
        ]
}

module.exports = {
    condition,
    condition2,
    condition3
 }