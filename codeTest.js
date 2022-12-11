const allProducts = [
    {id:1,name:'Hammer1'},
    {id:2,name:'Hammer2'},
    {id:3,name:'Hammer3'},
    {id:4,name:'Hammer4'},
    {id:5,name:'Hammer5'}
]
const newData = allProducts.find(product => product.id == 6) || {};

newData.id = 6;
newData.name='Hammer-6'
console.log(newData);