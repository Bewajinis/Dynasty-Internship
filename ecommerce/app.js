const wrapper = document.querySelector(".sliderWrapper")

const menuItem = document.querySelectorAll(".menuItem")

menuItem.forEach((item,index)=>{
    item.addEventListener('click', ()=>{
        wrapper.style.transform=`translateX(${-100 * index}vw)`;
    });
});

const products = [
    {
        id: 1,
        title: "Air Force",
        price: 250000,
        colors: [

            {
                code: "black",
                img:  "./images/air.png",
            },
            {
                code: "darkblue",
                img:  "./images/air2.png",
            },
        ],
    },
    {
        id: 2,
        title: "Air Jordan",
        price: 200000,
        colors: [

            {
                code: "lightgray",
                img:  "./images/jordan.png",
            },
            {
                code: "green",
                img:  "./images/jordan2.png",
            },
        ],
    },
    {
        id: 3,
        title: "Blazer",
        price: 350000,
        colors: [

            {
                code: "lightgray",
                img:  "./images/blazer.png",
            },
            {
                code: "green",
                img:  "./images/blazer2.png",
            },
        ],
    },
    {
        id: 4,
        title: "Crater",
        price: 250000,
        colors: [

            {
                code: "black",
                img:  "./images/crater.png",
            },
            {
                code: "lightgray",
                img:  "./images/crater2.png",
            },
        ],
    },
    {
        id: 5,
        title: "Hippie",
        price: 600000,
        colors: [

            {
                code: "gray",
                img:  "./images/hippie.png",
            },
            {
                code: "lightgray",
                img:  "./images/hippie2.png",
            },
        ],
    },
];

let choosenProduct = products[0]

const currentProductImg = document.querySelector(".productImg");
const currentProductTitle = document.querySelector(".productTitle");
const currentProductPrice = document.querySelector(".productPrice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

menuItem.forEach((item, index) => {
    item.addEventListener("click", () => {
        // change the current slide
        wrapper.style.transform = `translateX(${-100 * index}vw)`;

        // change the chosen product
        choosenProduct = products[index]

        // change texts of currentProduct
        currentProductTitle.textContent = choosenProduct.title;
        currentProductPrice.textContent = "#" + choosenProduct.price;
        currentProductImg.src = choosenProduct.colors[0].img;

        // assing new colors
        currentProductColors.forEach((color, index) => {
            color.style.backgroundColor = choosenProduct.colors[index].code;
        });
    });
});

currentProductColors.forEach((color, index)=>{
    color.addEventListener('click', ()=>{
        currentProductImg.src = choosenProduct.colors[index].img
    })
});

currentProductSizes.forEach((size, index)=> {
    size.addEventListener("click",()=>{
        currentProductSizes.forEach("click", () => {
            size.style.backgroundColor = 'white';
            size.style.color = 'black'
        });
        size.style.backgroundColor = "black"
        size.style.color= "white"
    });
});

const productButton = document.querySelector(".productButton");
const payment = document.querySelector(".payment");
const close = document.querySelector(".close");

productButton.addEventListener("click", () => {
    payment.style.display="flex"

});

close.addEventListener("click", () => {
    payment.style.display="none"
});

// paystack
const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', payWithPaystack, false);

function payWithPaystack() {

    let handler = PaystackPop.setup({
        key: 'pk_test_353ab3a55e63e69dda077c9f8e6361cac84db427',
        email: document.getElementById('email-address').value,
        amount: document.querySelector(".productPrice").value * 100,
        currency: "NGN",
        ref: ''+Math.floor((Math.random() + 100000000) +1),

        onClose: function(){
            alert('Window closed.');
        },
        callback: function(response){
            let message = 'Payment complete! Reference: ' + response.reference;
            alert(message);
        }
    });

    handler.openIframe();


}

 