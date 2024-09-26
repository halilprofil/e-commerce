"use client"

import Link from "next/link";

import İmage from "next/image";

import { useEffect, useState } from "react";

export default function Category({ params }) {

const [data,setData] = useState([]);




    const {  category } = params;

    useEffect(() => {
        async function getData() {
            const response = await fetch(`https://dummyjson.com/products/category/${category}`)
            const {products} = await response.json();
            setData(products);

            
        }

        getData();
      },[category]);

  
return(
    <>
        <div className="product-container">

            {data.map(x =>
                <div key={x.id}>
                    <İmage src={x.thumbnail} width={300} height={300} alt={x.title} priority={true}/>
                    <p>{x.title}</p>
                    <span>{x.price}</span>
                    <p>{x.description}</p>
                    <Link href={"/buy/"+ x.id}>Satın Al </Link>
                </div>
            )}

        </div>

    </>
)

}