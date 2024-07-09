const {exec} = require('child_process');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

/**
 * 执行 github cli 命令
 */
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(
            command,
            {encoding: 'utf-8'},
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject('run gh failed: ' + stderr);
                    return;
                }

                resolve(stdout);
            }
        );
    });
}

/**
 * 获取所有处在 open 状态的 issue
 */
async function getOpenIssuesID() {
    const res = await runCommand('gh issue list --repo SearchFeed/weekly --json number');
    return JSON.parse(res).map(item => item.number);
}

/**
 * 读取 issue 的 body 部分
 */
async function readIssueContent(id) {
    const res = await runCommand(`gh issue view --repo SearchFeed/weekly ${id} --json body`);
    const body = JSON.parse(res).body;
    const lines = body.split('\r\n');
    const data = lines.reduce((prev, item) => {
        let [key, value] = item.split('：');
        key = key.replace('- ', '');
        prev[key] = value;
        return prev;
    }, {});
    return data;
}

async function run() {
    // 获取所有 issue id
    const issueIDs = await getOpenIssuesID();

    // 获取 issue 的内容
    const dataFetching = [];
    issueIDs.forEach(id => {
        dataFetching.push(readIssueContent(id));
    });
    const res = await Promise.all(dataFetching);

    // 归类
    const blog = {};
    res.forEach(item => {
        const cate = item['类别'];
        const url = item['链接'];
        const title = item['标题'];
        const reason = item['推荐理由（文章评论/解读）'];
        if (!cate || !url || !title || !reason) {
            console.warn('missing content: ' + JSON.stringify({
                cate,
                url,
                title,
                reason
            }));
            return;
        }

        if (!blog[cate]) {
            blog[cate] = [];
        }

        blog[cate].push({
            url,
            title,
            reason
        });
    });

    // 产出内容
    const day = moment().format('YYYY.MM.DD');
    let content = `# 前端技术双周刊-${day}\n\n`;
    Object.keys(blog).forEach(cate => {
        content += `## ${cate}\n`;
        const articles = blog[cate];
        content += articles.map(a => `- [${a.title}](${a.url})\n<br>${a.reason}\n\n`).join('');
    });

    fs.writeFileSync(path.resolve(__dirname, `../docs/${moment().format('YYYY-M-D')}.md`), content, 'utf-8');

    console.log(`::set-output name=issues::${issueIDs.map(item => `resolve: #${item}`).join(' ')}`);
}

run();

