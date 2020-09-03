const pandoc = require("node-pandoc")
const cheerio = require("cheerio")
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
var mysql = require('nodejs-mysql').default;
const db = mysql.getInstance({
    host: 'localhost',
    user: 'root',
    password: '*****',
    database: 'BackFiler'
});


let getHTML = dir => {
    return new Promise((res, rej) => {
        const args = '-f docx -t html5';
        pandoc(dir, args, (e, r) => {
            if (e) {
                rej(e)
                return
            }
            res(r)
        });
    })
}

let handleFile = async dir => {
    let html = await getHTML(dir)
    cards = [];
    var $ = cheerio.load(html);
    let h4 = $('h4')
    for (let i = 0; i < h4.length; i++) {
        let elem = h4[i]
        var item = $(elem);
        var card = {
            tag: item.text(),
            cite: item.next().contents().filter('strong').text(),
            card: "<h4>" + item.text() + "</h4>" + item.nextUntil('h1, h2, h3, h4').toArray().map(p => "<p>" + $(p).html() + "</p>").join(''),
            text: item.nextUntil('h1, h2, h3, h4').text(),
            h1: item.prevAll('h1').eq(0).text(),
            h2: item.prevAll('h2').eq(0).text(),
            h3: item.prevAll('h3').eq(0).text(),
            index: i
        };
        if (card.tag && card.cite && card.card) {
            await db.exec('INSERT INTO cards set ?', {
                id: uuidv4(),
                tag: card.tag,
                cite: card.cite,
                card: card.card,
                text: card.text,
                file: dir
            })
            console.log(`carded: ${card.tag}`)
        }
    }
    return
}

let crawl = dir => {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const paths = [];

    dirents.forEach(dirent => {
        const res = `${dir}/${dirent.name}`;
        if (dirent.isDirectory()) {
            crawl(res).forEach(v => paths.push(v));
        } else {
            if (dirent.name.split(".docx").length == 2)
                paths.push(res);
        }
    });
    return paths;
}
(async () => {
    let files = crawl("/Users/neelredkar/Dropbox")

    for (let i = 0; i < files.length; i++) {
        try {
            await handleFile(files[i])
        } catch {
            console.log("File error, moving on!")
        }
    }
    console.log("DONE: Indexed all files!")
    process.exit(0)
})()