class Product {
    constructor() {
        this.spanCount = document.getElementById('span-count');
        this.cartBtn = document.getElementById('cart-btn');
        this.products = document.getElementById('products-center');
        this.spanCount.textContent = 0;
    }

    render() {
        this.cartBtn.addEventListener('click', () => {
            cart.showCart();
            cart.closeCart();
        });

        SAMPLE_DATA.items.forEach((item) => {

            let article = builder
                .create('article')
                .appendTo(this.products)
                .className('product')
                .build();

            let imgContainer = builder
                .create('div')
                .className('img-container')
                .appendTo(article);

            const btnAdd = builder
                .create("button")
                .html('<i class="fas fa-shopping-basket"></i>Add to cart')
                .className("bag-btn")
                .appendTo(imgContainer)
                .on("click", () => {
                    let productItem = {
                        name: item.fields.title,
                        pic: item.fields.image,
                        price: item.fields.price,
                        id: item.sys.id,
                    }
                    cart.addItem(productItem);
                });

            let image = builder
                .create('img')
                .className('product-img')
                .src(item.fields.image)
                .appendTo(imgContainer)
                .build();
            let texts = builder
                .create('h3')
                .text(item.fields.title)
                .appendTo(article)
                .build();
        });
    }
}

class Cart {
    constructor() {
        this.cartItems = [];
        this.cartContent = document.querySelector(".cart-content");
        this.total = document.getElementById('cart-total');

    }

    render() {
        this.cartContent.innerHTML = '';
        let total = 0;

        this.cartItems.forEach(element => {
            total += element.totalPriceProduct();
            this.cartContent.appendChild(element.render())
        });
        this.total.textContent = total
    }

    removeItem(item) {
        this.cartItems = this.cartItems
            .filter(element => element.productItem.productItem.id !== item),
            this.render()
    }

    addItem(item) {
        const existItem = this.cartItems.find(element =>
            element.productItem.productItem.id === item.id);

        if (existItem) {
            ++existItem.count;

        } else {
            this.cartItems.push(new CartItem({
                productItem: item,
            }))
            this.render()
            console.log(this.cartItems)
        }
        product.spanCount.textContent++;
    }

    showCart() {
        document.querySelector(".cart-overlay")
            .classList.add('transparentBcg');

        document.querySelector(".cart")
            .classList.add('showCart');

        cart.render()
    }

    closeCart() {
        let close = document.getElementById('close');
        close.addEventListener('click', () => {
            document.querySelector(".cart-overlay")
                .classList.remove('transparentBcg');

            document.querySelector(".cart")
                .classList.remove('showCart');
        });
    }

    clearCart() {
        this.cartItems = [];
        product.spanCount.textContent = 0;
        this.render();
    }
}

class CartItem {

    constructor(productItem) {
        this.total = 0;
        this.productItem = productItem;
        this.count = 1;
    }

    render() {

        const div = builder
            .create("div")
            .className("cart-item");

        builder
            .create("img")
            .src(this.productItem.productItem.pic)
            .appendTo(div);

        const innerDiv = builder
            .create("div")
            .appendTo(div);

        builder
            .create("h4")
            .text(this.productItem.productItem.name)
            .appendTo(innerDiv),

            builder
            .create("h5")
            .text(this.totalPriceProduct())
            .appendTo(innerDiv),

            builder
            .create("span")
            .className("remove-item")

        .text("remove")
            .on('click', () => {
                cart.removeItem(this.productItem.productItem.id)
                product.spanCount.textContent--;
            })
            .appendTo(innerDiv);
        const countBox = builder
            .create("div")
            .appendTo(div);

        let textcount = builder
            .create("p")
            .className("item-amount")
            .text(this.count)
            .appendTo(countBox);

        return builder
            .create("i")
            .className("fas fa-chevron-up")
            .on("click", () => {
                this.count = ++this.count;
                textcount.text(this.count)
                cart.render()
                product.spanCount.textContent++;
            }).appendTo(countBox),

            builder
            .create("i")
            .className("fas fa-chevron-down")
            .on("click", () => {
                if (this.count > 1) {

                    this.count = --this.count;
                    product.spanCount.textContent--;
                    textcount.text(this.count)
                    cart.render()

                    this.render()
                } else if (this.count === 1) {
                    cart.removeItem(this.productItem.productItem.id)
                    product.spanCount.textContent--;
                }
            }).appendTo(countBox), div.build()

    }

    totalPriceProduct() {
        return this.productItem.productItem.price * this.count
    }

}
let product = new Product();
product.render();

const cart = new Cart()
clearBtn = document.querySelector(".clear-cart");
clearBtn.addEventListener("click", () => cart.clearCart())