let scrapeEmails = document.getElementById ('scrapeEmails');

let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request,
sender,sendResponse)=>{
    
    // Get mails
    let emails = request.emails;
    
    // Display emails on popup
    if(emails == null || emails.length == 0) {
        // No mails
        let li = document.createElement('li');
        li.innerText = " No emails found ";
        list.appendChild(li);
    }else {
        // display emails
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
    }
} )

scrapeEmails.addEventListener("click", async () =>{
    
    // get current active tab
    let [tab] = await chrome.tabs.query({active: true , currentWindow: true});

    // extecute script to parse emails on page

    chrome.scripting.executeScript({
        target :{tabId: tab.id},
        func: scrapeEmailsFromPage,
    
    });
})


// Functions to scrape Emails
function scrapeEmailsFromPage() {
    
    // RegEx to parse emails from the html code
    const emailRegEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    // parse Emails from the html of the page
    let emails = Array.from(document.body.innerHTML.matchAll(emailRegEx), match => match[0]);

    // send emails to popup
    chrome.runtime.sendMessage({emails});
}