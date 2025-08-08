const fs = require('fs');
const { execSync } = require('child_process');

// 获取docs目录下所有md文件
const mdFiles = fs
    .readdirSync('docs')
    .filter((f) => f.endsWith('.md') && /^\d{4}-\d{1,2}-\d{1,2}\.md$/.test(f))
    .sort((a, b) => {
        const dateA = new Date(a.split('.')[0]);
        const dateB = new Date(b.split('.')[0]);
        return dateB - dateA;
    });

// 读取README内容
let readme = fs.readFileSync('README.md', 'utf8');

// 生成日志条目
const logEntries = mdFiles.map((mdFile, index) => {
    const dateStr = mdFile.split('.')[0];
    return `- [前端技术双周刊第 ${
        mdFiles.length - index
    } 期](https://searchfeed.github.io/weekly/${dateStr})`;
});

// 替换日志部分
const updatedReadme = readme.replace(
    /(### 周刊日志\n)(?:- .*\n)+/,
    `### 周刊日志\n${logEntries.join('\n')}\n`
);

// 写入更新后的README
fs.writeFileSync('README.md', updatedReadme, 'utf8');

// 设置git配置
execSync('git config --global user.name "github-actions[bot]"');
execSync(
    'git config --global user.email "github-actions[bot]@users.noreply.github.com"'
);
execSync('git add README.md');
execSync('git commit -m "$(date +%F) Update weekly logs in README"');
execSync('git push');
