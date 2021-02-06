const fields = document.querySelectorAll("input[type='text'],input[type='number']");

const fv = {
  uber: {
    earning: 0,
    bonus: 0,
    vat(){
      let fee = ceil(.3611*this.earning);
      let tax = ceil(.23*fee);
      let gross = ceil(this.earning+fee+tax);
      return ceil((gross-(gross/1.08))-tax);
    }
  },
	bolt: {
		earning: 0,
		bonus: 0,
		vat(){
			return ceil(this.earning - (this.earning/1.08));
		}
  },
	businessFee: {  
		partner: 20,
		contract: 0,
		additional: 0,
		tax: false,
		total(){
			return ceil(this.partner);
		}
  },
	othersFee: {
		partner: 40,
		contract: 20,
		additional: 40,
		tax: true,
		total(isAddition){
			if(isAddition)  return ceil(this.partner+this.contract+this.additional);
			else return ceil(this.partner+this.contract);
		}
  },
  sums: {
    bonuses(){
      return fv.uber.bonus + fv.bolt.bonus;
    },
    overallEarning(){
      return fv.uber.earning + fv.bolt.earning+this.bonuses();
    },
    business_pfna(){
      return fv.businessFee.total();
    },
    others_pfna(isAdd){
      return fv.othersFee.total(isAdd);  
    },
    taxes(){
      let allVATS = ceil(fv.uber.vat()+fv.bolt.vat());
      return allVATS;
    },
    payout(isAdd, isBusiness){
      let vats = 0;
      let fees = 0;
      if(isBusiness){
        fees =  this.business_pfna();
        return ceil(this.overallEarning()-fees);
      }else{
        vats = fv.uber.vat() + fv.bolt.vat();
        fees = fv.othersFee.total(isAdd);
        return ceil(this.overallEarning()-vats-fees);
      }      
    }
  }
};
const uberEarn = document.querySelector('.uberEarning');
const uberBonus = document.querySelector('.uberBonus');
const boltEarn = document.querySelector('.boltEarning');
const boltBonus = document.querySelector('.boltBonus');
const isCom = document.querySelectorAll('.options');

///////
////////forecast section
///////
inputField(uberEarn, _=>{
  fv.uber.earning = Number(uberEarn.value.trim());
  results();
});

inputField(uberBonus, _=>{
  fv.uber.bonus = Number(uberBonus.value.trim());
  results();
});

inputField(boltEarn, _=>{
  fv.bolt.earning = Number(boltEarn.value.trim());
  results();
});

inputField(boltBonus, _=>{
  fv.bolt.bonus = Number(boltBonus.value.trim());
  results();
});

let isCompany = false;

isCom.forEach(i=>{
  i.addEventListener('click',_=>{
  if(i.value == "business") isCompany = true;
  else isCompany = false;
  return results();
});
});

var objs;
function results(){

fields.forEach(item=>{

///////
////////fee section
///////
if(item.className == 'partnerFee'){
  if(!isCompany){
    if(uberEarn.value !== "" && boltEarn.value !== "")
      item.value = fv.othersFee.partner+fv.othersFee.additional;
      else item.value = fv.othersFee.partner;
  }else item.value = fv.businessFee.partner;
}

else if(item.className == 'uberVat'){
if(!isCompany) item.value = fv.uber.vat();
else item.value = 0;
}

else if(item.className == 'boltVat'){
if(!isCompany) item.value = fv.bolt.vat();
else item.value = 0;
}

else if(item.className == 'contractFee'){
  if(!isCompany) item.value = fv.othersFee.contract;
  else item.value = fv.businessFee.contract;
}
///////
////////summary section
///////
else if(item.className == 'overallEarning') item.value = fv.sums.overallEarning();

else if(item.className == 'partnerFeeWithAccounting'){
  if(!isCompany){
    if(uberEarn.value !== "" && boltEarn.value !== "")
      item.value = fv.sums.others_pfna(true);
      else  item.value = fv.sums.others_pfna(false);
  }else item.value = fv.sums.business_pfna();
}

else if(item.className == 'taxes'){
if(!isCompany) item.value = fv.sums.taxes();
else item.value = 0;
}

else if(item.className == 'finalPayout')
if(!isCompany){
    if(uberEarn.value !== "" && boltEarn.value !== "")
      item.value = fv.sums.payout(true, false);
      else item.value = fv.sums.payout(false, false);
  } else item.value = fv.sums.payout(false, true);
});
}

function inputField(item, callback){
  item.addEventListener('input', callback);
  }

function ceil(value){ return Math.ceil(value * 100) / 100; } 