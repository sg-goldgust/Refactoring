let plays = require("../repository/plays.js"); //require vs import
let invoices = require("../repository/invoices.json");
let amountFor = (aPerformance) => {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case "tragedy": //비극
      thisAmount = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy": //희극
      thisAmount = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
  }
  return result;
};

let playFor = (aPerformance) => {
  return plays[aPerformance.playID];
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

  for (let aPerformance of invoice.performances) {
    //const play = plays[aPerformance.playID]; 임의 변수를 질의 함수로 바꾸기
    //let thisAmount = amountFor(aPerformance); 임의 변수를 inline로 바꾸기
    //포인트를 적립한다
    volumeCredits = Math.max(aPerformance.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다
    if (playFor(aPerformance).type == "comedy")
      volumeCredits += Math.floor(aPerformance.audience / 5);
    //청구 내역을 출력한다
    result += `  ${playFor(aPerformance).name}: ${format(
      amountFor(aPerformance) / 100
    )}\n`;
    totalAmount += amountFor(aPerformance);
  }
  result += `총액 : ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 : ${format(volumeCredits)}`;
  return result;
};

console.log(statement(invoices[0], plays));
