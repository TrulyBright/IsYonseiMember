const puppeteer = require("puppeteer");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const {id, pw} = req.query
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"); // without this, static files (css/image/JS) are not loaded.
    await page.goto("https://portal.yonsei.ac.kr");
    let anchor = await page.waitForSelector("a#jooyohaksalink1.box_anchor")
    await anchor.click()
    let idInput = await page.waitForSelector("input#loginId")
    await idInput.focus()
    await page.keyboard.type(id)
    let pwInput = await page.waitForSelector("input#loginPasswd")
    await pwInput.focus()
    await page.keyboard.type(pw)
    let submitButton = await page.waitForSelector("button#loginBtn.submit")
    await submitButton.click()
    let nameElementId = "#wq_uuid_63";
    let deptMajorElementId = "#wq_uuid_77";
    let statusElementId = "#wq_uuid_90";
    let idArray = [nameElementId, deptMajorElementId, statusElementId];
    let elements = await Promise.all(idArray.map(id=>page.waitForSelector(id)));
    let textHandles = await Promise.all(idArray.map(id=>page.waitForFunction(`document.querySelector("${id}").textContent`)));
    let texts = textHandles.map(handle=>handle.toString().replace("JSHandle:", ""));
    let name = texts[0]
    let deptMajor = texts[1]
    let status = texts[2]
    await browser.close();
    context.res = {
        body: {name: name, deptMajor: deptMajor , status: status}
    };
}
