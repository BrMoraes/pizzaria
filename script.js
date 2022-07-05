let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Se você só quer percorrer é o for in (dos loops o melhor mesmo é o for of), ou o método forEach, map é usado quando você quer criar um novo array a partir do original.
pizzaJson.map((item, index)=>{   // daqui que ele montou 7 estrutuas (está no outro JS)
   let pizzaItem = c('.models .pizza-item').cloneNode(true);
   let p = (el) => pizzaItem.querySelector(el);
   // preencher as informações em pizza-item

   pizzaItem.setAttribute('data-key', index);
   p('.pizza-item--img img').src = item.img;
   p('.pizza-item--name').innerHTML = item.name;
   p('.pizza-item--desc').innerHTML = item.description;
   
   p('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
      // p('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
   
   p('a').addEventListener('click', (e)=>{
      
      e.preventDefault();   // remove a ação padrão da tag a
      let key = e.target.closest('.pizza-item').getAttribute('data-key');
      modalQt = 1;
      modalKey = key;

      c('.pizzaBig img').src = pizzaJson[key].img;
      c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
      c('.pizzaInfo--size.selected').classList.remove('selected');
      
      cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
         if(sizeIndex == 2) {
            size.classList.add('selected');
         }
         size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });

      c('.pizzaInfo--qt').innerHTML = modalQt;  // sempre que o usuário fechar e abrir o modal, a quantidade voltará para 1

      c('.pizzaWindowArea').style.opacity = 0;
      c('.pizzaWindowArea').style.display = 'flex';
      setTimeout(()=>{
         c('.pizzaWindowArea').style.opacity = 1;
      }, 200);     // Cria um efeito de transição no modal junto com o CSS.

   });


   c('.pizza-area').append( pizzaItem );
});

// Eventos do Modal

function closeModal() {
   c('.pizzaWindowArea').style.opacity = 0;
   setTimeout(()=>{
      c('.pizzaWindowArea').style.display = 'none';
   }, 500);
}


cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
   item.addEventListener('click', closeModal);  
});  
// Também poderia ser feito adicionando um onclick no HTML, mas o mais indicado é fazer tudo no JS para que o código fique mais limpo e manipulável.
// Quando você coloca utiliza o "closeModal" você está fazendo referência a uma função e quando você usa o "closeModal()" você está chamando a função, ou seja, tá executando ela.
// O addEventListener vai pegar a função que queremos e executá-la quando ocorrer o evento desejado, no caso foi o 'click'.

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
   if(modalQt > 1) {
      modalQt--;
      c('.pizzaInfo--qt').innerHTML = modalQt;
   }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
   modalQt++;
   c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
      c('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
   });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
   let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
   
   let identifier = pizzaJson[modalKey].id+'@'+size;

   let key = cart.findIndex((item)=>item.identifier == identifier);

   if(key > -1) {
      cart[key].qt += modalQt;
   } else {
      cart.push({
         identifier,
         id:pizzaJson[modalKey].id,
         size,
         qt:modalQt
      });
   }
   updateCart();
   closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
   if(cart.length > 0) {
      c('aside').style.left = '0';
   }
   
});
c('.menu-closer').addEventListener('click', ()=> {
   c('aside').style.left = '100vw';
})

function updateCart() {
   c('.menu-openner span').innerHTML = cart.length;

   if(cart.length > 0) {
      c('aside').classList.add('show');
      c('.cart').innerHTML = '';

      let subtotal = 0;
      let desconto = 0;
      let total = 0;

      for(let i in cart) {

         let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
         subtotal += pizzaItem.price * cart[i].qt;


         let cartItem = c('.models .cart--item').cloneNode(true);

         let pizzaSizeName;
         switch(cart[i].size) {
            case 0:
               pizzaSizeName = 'P';
               break;
            case 1:
               pizzaSizeName = 'M';
               break;
            case 2:
               pizzaSizeName = 'G';
               break;
         }
         let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

         cartItem.querySelector('img').src = pizzaItem.img;
         cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
         cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
         cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
            if(cart[i].qt > 1) {
               cart[i].qt--;
            } else {
               cart.splice(i, 1);
            }
            updateCart();
         });
         cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
            cart[i].qt++;
            updateCart();
         });

         c('.cart').append(cartItem);
      }

      desconto = subtotal * 0.1;
      total = subtotal - desconto;

      c('.subtotal span:last-child').innerHTML = `${subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

      c('.desconto span:last-child').innerHTML = `${desconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

      c('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

      
   } else {
      c('aside').classList.remove('show');
      c('aside').style.left = '100vw';
   }
}