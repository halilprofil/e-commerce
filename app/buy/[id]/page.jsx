"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Category({ params }) {
    const [data, setData] = useState(null); // Ürün verisi
    const [count, setCount] = useState(0); // Ürün sayısı
    const [addedProduct, setAddedProduct] = useState([]); // Sepete eklenen ürünler
    const [cartHidden, setCartHidden] = useState(true); // Sepet görünürlüğü

    const { id } = params; // Route'dan gelen id parametresi

    useEffect(() => {
        async function getData() {
            const response = await fetch(`https://dummyjson.com/products/${id}`);
            const product = await response.json();
            setData(product); // Ürün verisini state'e set ediyoruz
        }
        getData();
    }, [id]);

    // Ürün miktarını artırma
    function IncreaseBtn() {
        return <button onClick={() => setCount((prevCount) => prevCount + 1)}>+</button>;
    }

    // Ürün miktarını azaltma (negatif olmamalı)
    function DecreaseBtn() {
        return <button onClick={() => setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0))}>-</button>;
    }

    // Sepete ürün ekleme
    function AddProductBtn() {
        function addProduct() {
            if (count === 0) {
                alert('Lütfen en az bir ürün ekleyin.');
                return;
            }

            const productObj = {
                name: data.title,
                price: data.price,
                count: count,
                id: data.id,
            };

            setAddedProduct((prevProducts) => [...prevProducts, productObj]);
            setCount(0); // Ürün eklendikten sonra sayıyı sıfırlıyoruz
        }

        return (
            <button className="add-product" onClick={addProduct}>
                Add to cart
            </button>
        );
    }

    // Sepetteki ürün bileşeni
    function CartItem({ name, price, count, id, thumbnail }) {
        function deleteItem() {
            let products = addedProduct.filter((x) => x.id !== id);
            setAddedProduct(products);
        }

        return (
            <div className="cart-item">
                <Image className="cart-img" src={thumbnail} alt={name} width={50} height={50} priority />
                <div className="mid">
                    <span className="grey">{name}</span>
                    <div className="mid-content">
                        <span className="grey">
                            {price} x {count}
                        </span>
                        <span className="dark-color">${price * count}</span>
                    </div>
                </div>
                <button onClick={deleteItem}>
                    <p>X</p>
                </button>
            </div>
        );
    }

    // Sepetin render edilmesi
    function RenderCart({ addedProduct }) {
        return (
            <div className="cart-list">
                {addedProduct.map((x) => (
                    <CartItem
                        key={x.id} // `key` prop'u eklendi
                        id={x.id}
                        name={x.name}
                        price={x.price}
                        count={x.count}
                        thumbnail={data.thumbnail} // Ürüne ait görsel verisi kullanıldı
                    />
                ))}
            </div>
        );
    }

    // UI render kısmı
    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="header-btn">
                        <button onClick={() => setCartHidden(!cartHidden)}>
                            <div className={addedProduct.length === 0 ? 'hidden' : 'cart-count'}>
                                {addedProduct.length !== 0 ? addedProduct.length : ''}
                            </div>
                            <p className="basket">Cart</p>
                        </button>
                    </div>
                </div>

                <div className="content">
                    <div className={cartHidden ? 'cart hidden' : 'cart'}>
                        <h3 className="title">Cart</h3>
                        <RenderCart addedProduct={addedProduct} />
                        <button
                            onClick={() => setAddedProduct([])}
                            className={addedProduct.length === 0 ? 'hidden' : 'confirm'}
                        >
                            Checkout
                        </button>
                        <div className={addedProduct.length === 0 ? 'cart-content' : 'hidden'}>
                            <p className="grey any">Your cart is empty.</p>
                        </div>
                    </div>

                    {data && (
                        <div className="content-img">
                            <div className="big-img">
                                {/* Image bileşeni ile görsel optimize edildi */}
                                <Image
                                    src={data.thumbnail}
                                    alt={data.title}
                                    width={500}
                                    height={500}
                                    priority={true} // Görsel için `priority` eklendi
                                />
                            </div>
                        </div>
                    )}
                    {data && (
                        <div className="content-text">
                            <span className="orange">{data.brand}</span>
                            <h1 className="dark-color">{data.title}</h1>
                            <p className="grey">{data.description}</p>
                            <div className="price-control">
                                <h3 className="dark-color">${data.price}</h3>
                                <span className="sale orange">{data.discountPercentage}% Off</span>
                            </div>
                            <span className="old-price grey">${(data.price / (1 - data.discountPercentage / 100)).toFixed(2)}</span>
                            <div className="count-control">
                                <div className="btn-list">
                                    <IncreaseBtn />
                                    <p>{count}</p>
                                    <DecreaseBtn />
                                </div>
                                <AddProductBtn />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
