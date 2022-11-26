let plays = require("../repository/plays.js"); //require vs import
let invoices = require("../repository/invoices.json");
let amountFor = (perf, play) => {
  let thisAmount = 0;
  switch (play.type) {
    case "tragedy": //비극
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy": //희극
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${perf.audience}`);
  }
  return thisAmount;
};

let statement = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);
    //포인트를 적립한다
    volumeCredits = Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다
    if (play.type == "comedy") volumeCredits += Math.floor(perf.audience / 5);
    //청구 내역을 출력한다
    result += `  ${play.name}: ${format(thisAmount / 100)}\n`;
    totalAmount += thisAmount;
  }
  result += `총액 : ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 : ${format(volumeCredits)}\n`;
  return result;
};

console.log(statement(invoices[0], plays));