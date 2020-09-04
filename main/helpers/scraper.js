import { app } from 'electron';
import pandoc from "node-pandoc"
import fix from "fix-path"
import cheerio from "cheerio"
import { v4 } from "uuid"
import fs from "fs"
import sqlite3 from "sqlite3"
import path from "path"

fix()

var db = new sqlite3.Database(path.join(app.getPath("userData"), "debateCards.db"));

let getHTML = dir => {
    return new Promise((res, rej) => {
        const args = '-f docx -t html5';
        pandoc(dir, args, (e, r) => {
            if (e) {
                console.log(e)
                rej(e)
                return
            }
            res(r)
        });
    })
}

let handleFile = async (dir, cb) => {
    var html = ""
    try {
        html = await getHTML(dir)
    } catch{
        return
    }
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
            try {
                db.run('INSERT INTO cards VALUES(?,?,?,?,?,?)', [
                    v4(),
                    card.tag,
                    card.cite,
                    card.card,
                    card.text,
                    dir
                ])
                cb(card.tag, dir)
            } catch {
                console.log("QUERY ERROR, MOVING ON!")
            }
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

export default async (dir, cb) => {
    let paths = crawl(dir)

    for (let i = 0; i < paths.length; i++) {
        try {
            await handleFile(paths[i], cb)
        } catch {
            console.log("err")
        }
    }
}