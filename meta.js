/**
 * package.json元数据
 */

module.exports = {
    
    prompts: {
        name: {
            type: 'string',
            required: true,
            message: 'Project name',
        },
        description: {
            type: 'string',
            required: false,
            message: 'Project description',
            default: 'A swan(百度小程序) project with ziu',
        },
        author: {
            type: 'string',
            message: 'Author',
        },
        tab: {
            type: 'confirm',
            message: 'Use Tab?',
        },
        // lint: {
        //     type: 'confirm',
        //     message: 'Use ESLint to lint your code?',
        // },
        // lintConfig: {
        //     when: 'lint',
        //     type: 'list',
        //     message: 'Pick an ESLint preset',
        //     choices: [
        //         {
        //             name: 'Standard (https://github.com/standard/standard)',
        //             value: 'standard',
        //             short: 'Standard',
        //         },
        //         {
        //             name: 'Airbnb (https://github.com/airbnb/javascript)',
        //             value: 'airbnb',
        //             short: 'Airbnb',
        //         },
        //         {
        //             name: 'none (configure it yourself)',
        //             value: 'none',
        //             short: 'none',
        //         },
        //     ],
        // },
        // sass: {
        //     type: 'confirm',
        //     message: 'Use sass?'
        // }
    },
    filters: {
        '.eslintrc.js': 'lint',
        '.eslintignore': 'lint'
    }
};