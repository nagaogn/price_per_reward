// ==UserScript==
// @name         price_per_reward
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show minecoin per arenacoin or event pt in marketplace
// @author       nagao
// @match        https://minesweeper.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minesweeper.online
// @grant        none
// ==/UserScript==

{
    'use strict';

    const rewardsDefault = [10, 25, 50, 100, 150, 200, 300, 400];
    const rewardsTicket9 = rewardsDefault.map(r => r * 2);
    const rewardsTicket10 = rewardsDefault.map(r => r * 5);

    const rewardsMap = {
        0: rewardsDefault,
        9: rewardsTicket9,
        10: rewardsTicket10
    };

    const page = document.getElementById('page');

    const observer = new MutationObserver(mutationList => {
        if(location.pathname.endsWith("marketplace")) {
            for (const mutation of mutationList) {
                if(mutation.addedNodes[0]?.tagName === "TR") {
                    const itemCell = mutation.addedNodes[0].cells[1];
                    const ticketIcon = itemCell.querySelector(".ticket");
                    if(!!ticketIcon){
                        const regex = /^ticket[1-8]$/;
                        if ([...ticketIcon.classList].some(c => regex.test(c))) {
                            addPricePerReward(itemCell.textContent, mutation.addedNodes[0].cells[2], "arenacoin", 0);
                        }else if(ticketIcon.classList.contains("ticket9")) {
                            addPricePerReward(itemCell.textContent, mutation.addedNodes[0].cells[2], "arenacoin", 9);
                        }else if(ticketIcon.classList.contains("ticket10")) {
                            addPricePerReward(itemCell.textContent, mutation.addedNodes[0].cells[2], "arenacoin", 10);
                        }else {
                            addPricePerReward(itemCell.textContent, mutation.addedNodes[0].cells[2], "event pt", 0);
                        }
                    }
                }
            }
        }
    });

    const addPricePerReward = (itemText, priceCell, rewardText, rewardsType) => {
        const match = itemText.match(/^L([1-8])/);
        const index = parseInt(match[1], 10) - 1;
        const reward = rewardsMap[rewardsType][index];
        const price = parseInt(priceCell.textContent.replace(" ", ""), 10);
        const pricePerReward = Math.round(price / reward);
        priceCell.innerHTML += `<br><span>(${pricePerReward} minecoin / ${rewardText})</span>`;
    }

    const config = { childList: true, subtree: true };

    observer.observe(page, config);

}
