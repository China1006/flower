let xPlace = document.querySelector('.xPlace')
let servePlace = document.querySelector('.servePlace')
const shopPlace = document.querySelector('.shopPlace')
console.log(xPlace.className)
function xHover(node) {
  const select =node.querySelector('div')
  addClass(node,select);
  removeClass(node,select)
}
function addClass(node,select) {
  node.onmouseover = ()=>{
    select.classList.add('reveal')
  }
}
function removeClass(node,select) {
  node.onmouseout = ()=>{
    select.classList.remove('reveal')
  }
}
xHover(xPlace);
xHover(servePlace);
xHover(shopPlace);
let aSelect = document.querySelectorAll('.mean a')
window.onscroll = scroll;
function scroll()
{
  const top = document.documentElement.scrollTop;
  if( top>= 1420 && top <3038){
    aSelect[0].classList.add('bg')
    aSelect[1].classList.remove('bg')
  }else if(top >=3038 && top < 4662){
    aSelect[0].classList.remove('bg')
    aSelect[1].classList.add('bg')
    aSelect[2].classList.remove('bg')

  }else if(top >= 4662 && top <5874){
    aSelect[1].classList.remove('bg')
    aSelect[2].classList.add('bg')
    aSelect[3].classList.remove('bg')
  }else if(top >= 5874){
    aSelect[2].classList.remove('bg')
    aSelect[3].classList.add('bg')
  }
}
function x(e) {

  console.log(e);
}