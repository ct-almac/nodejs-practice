
# Section 2: Introduction to Node.js and NPM

## 18. Introduction to npm and the package.json

Una vez finalizado el proyecto de Node-Farm, procedemos con la introducción a NPM y package.json

En la terminal integrada al proyecto, ejecutamos el comando `npm init` para inicializar npm y crear package.json.

A continuación, se pedirá información referente al proyecto para la creación del package.json:

`package name: node-farm`
`version: (1.0.0)`
`description: Learning node.js`
`entry point: (index.js)`
`test command:''` //empty
`git repository:''`
`keywords:''`
`author:{name}`
`license:(ISC)`

Antes de la creación del archivo, se muestra una vista previa en consola. Confirmamos.

## 19 Types of packages and installs

Se instalará el paquete **slugify** para el uso de urls amigables. Ejecutamos el comando `npm install slugify`.

A continuación, se instalará el paquete **nodemon**

> El paquete nodemon en Node.js es una herramienta muy útil para desarrolladores que trabajan en aplicaciones backend. Su función principal es monitorizar los archivos del proyecto y reiniciar automáticamente el servidor cuando detecta cambios en el código fuente.

Ejecutamos el comando `npm install nodemon --save-dev`. Es específica `--save-dev` para inidicar que esta dependencia solo estará disponible en development.

Este paquete suele ser utilizado en todos los proyectos, por lo que se recomienda instalarlo globalmente. Ejecutamos el comando `npm i nodemon --global`.

Verificar permisos para instalar globalmente.

### scripts as shortcuts

En el package.json se puede configurar en la sección "scripts" atajos para acceder desde consola y que ejecuten comandos especificados.

ejemplo:
`package.json`

```json
{
    "scripts":{
        "start":"nodemon index.js"
    }
}
```

Para ejecutar el atajo, ingresamos el comando `npm run start` o `npm start`, el cual ejecutará `nodemon index.js`.

## 20. Using modules 3: 3rd Party Modules

```js
//third party modules
const slugify= require('slugify'); // leer readme e instalar dependencias
```

```js
//slugify example
console.log(slugify('Fresh Avocados', {lowercase:true}));
```

Creamos un array con los en slugs para urls amigables, basándonos en el listado de productos obtenidos inicialmente

```js
const slugs = dataObj.map(el => slugify(el.productName, {lowercase:true}));
console.log(slugs);

```

## 21. Package version and updating

La notación semántica de las versiones de paquetes npm en package.json tiene el siguiente significado:

```json
"devDependencies":{
    "nodemon":"^1.18.11"
}
```

Donde el primer dígito representa `major version`: para grandes cambios.
La segunda posición reperesenta la `minor version`: para nuevas funcionalidades en el paquete.
La tercera representa `patch version`: para la corrección de bugs. 

El símbolo `^` indica que se aceptarán versiones `minor` y `patch`.
El símbolo `~` indica que solo se aceptarán versiones `patch`.
El símbolo `*` indica que se aceptarán versiones con grandes cambios `major`. NOTA: Tener cuidado, pues esta clase de versiones al contener grandes cambios pueden romper el código.

Para identificar paquetes desactualizados ingresamos el comando `npm outdated`.

Para desinstalar paquetes se utiliza el comando `npm uninstall <package_name>`

A continuación, se instalará y desinstalará Express como ejemplo.
Ejecutamos el comando `npm i express` para instalar el paquete.
Ejecutamos el comando `npm uninstall express` para desinstalarlo.

>Sobre node_modules: al compartir un proyecto, la carpeta **node_modules** no debería ser incluida, pues es mejor instalar los paquetes con npm. Al eliminar la carpeta node_modules, para recuperar las dependencias, bastará con ejecutar `npm install`, este comando recuperará las dependencias a través del package.json. Se creará un nuevo archivo llamado **package-lock.json** en el cual se encuentra información sobre los paquetes instalados y sus versiones.

## 22. Setting up Prettier on VS Code

Extensiones recomendades:
DotEnv
ESLint --para detectar bugs
Image preview
TODO Highlight
Prettier

Prettier puede ser personalizado a través del archivo de configuración con extensión `.prettierrc`.

# 5. Asynchronous Javascript: Promises and Asyn/Await

## 41 The problem with Callbacks: Callback hell

>Para las pruebas de este apartado se utilizará la api **https://dog.ceo/dog-api/documentation/breed**

Se utilizará el módulo filesystem `require('fs')`.

```js
const fs = require('fs');

fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
    console.log(`Breed: ${data}`);
});
```

Creamos el package.json `npm init`.

Instalamos `npm i superagent` para realizar peticiones a api.

Primero, obtenemos el módulo **superagent** para realizar la petición get a api.

Realizamos la lectura del archivo **dog.txt** para obtener la raza de perro que deseamos consulta. 

Dentro del callback, según la data obtenida, realizamos la petición con superagent. Accedemos a la imagen del tipo de perro.

```js
const fs = require('fs');
const superagent = require('supeagent');

fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
    console.log(`Breed: ${data}`);

    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err,res)=>{
        console.log(res.body);
    });
});

```

Una vez realizada la petición, el siguiente paso es escribir en el **dog-image.txt** la url de la imagen en la respuesta de la petición.

```js
fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
    if(err) return console.log(err.message);
    
    console.log(`Breed: ${data}`);
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err,res)=>{
        
        if(err) return console.log(err.message);

        console.log(res.body);
        fs.writeFile('dog-img.txt', res.body.message, err =>{
            console.log('Random dog image saved to file');
        });
    });
});
```

Podemos notar la cantidad de callbacks anidadas, lo que hace complicado el análisis-lectura del código. A esto se le llamada `callback hell`.

## From callback hell to promises

> Nota: el módulo superagent tiene soporte para promesas. 

Utilizamos promesas con then y catch.

```js
fs.readFile(`${__dirname}/dog.txt`,(err, data) =>{
   if(err) return console.log(err.message);
    console.log(`Breed: ${data}`);
    
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then(res=>{
        fs.writeFile('dog-img.txt', res.body.message, err =>{
            console.log('Random dog image saved to file');
        });
    })
    .catch(err=>{
        console.log(err.message);
    });
});
```

## 43. Building promises

La adaptación anterior sigue teniendo el problema del callback.Para evitar los callbacks creamos promesas.

La siguiente función crea una promesa para la lectura del archivo. Dentro de ella se realiza el callback, donde según la resolución obtenida, podemos retornar la función `resolve()` si la respuesta fue exitosa, o `reject()`, si hubo algún error. Podemos enviar los datos dentro de los parámetros de las funciones mencionadas.

```js

const readFilePro = file => {
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err, data) => {
            if(err) reject('I could not find that file ');
            
            resolve(data);
        });
    });
};
```

Para hacer uso de la promesa:

```js
//Pasamos el nombre del archivo
readFilePro(`${__dirname}/dog.txt`).then(data =>{
    console.log(data);
}).catch(err=>{
    console.error('hubo un error', err);
})

```

Ejemplo final del uso de promesas para evitar el callback hell:

```js
//convertimos la escritura del archivo en una promesa.
const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) =>{
        fs.writeFile(file, data ,(err, data) => {
            if(err) reject('I could not write the file ');
            resolve('success');
        });
    });
};

//retornando las promesas, podemos encadenarlas usando then.
readFilePro(`${__dirname}/dog.txt`).then(data =>{
  return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
})
.then( res=>{
  return writeFilePro('dog-img.txt', res.body.message);
})
.then( () => console.log('Random dog image saved to file'))
.catch(err=>{
    console.error('hubo un error', err);
});

```

## 44. Consuming promises with async/await

Ejemplo de uso de asyn/await para consumir promises

```js
const readFilePro = file => {
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err, data) => {
            if(err) reject('I could not find that file ');
            
            resolve(data);
        });
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) =>{
        fs.writeFile(file, data ,(err, data) => {
            if(err) reject('I could not write the file ');
            resolve('success');
        });
    });
};

const getDogPic = async () =>{
   const data = await readFilePro(`${__dirname}/dog.txt`);
   console.log(`Breed: ${data}`);
   const image = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
   console.log(`image: ${image}`);  
   await writeFilePro('dog-img.txt', res.body.message);
   console.log('Random dog image saved to file');
   
};

getDogPic();
```

Para el control de errores al usar async/await, agregamos un bloque try catch

```js
const getDogPic = async () =>{
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);
        const image = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(`image: ${image}`);  
        await writeFilePro('dog-img.txt', res.body.message);
        console.log('Random dog image saved to file');
        
    } catch (error) {
        console.log('erro:',error);
    } 
};

getDogPic();
```

## 45. Returning values from async functions

La forma de acceder a los valores de una promesa es a través del uso de then o await al asignarse a una variable.

Para poder acceder a un error es necesario que en la definición de la promesa utilicemos la función `throw()`.

```js
const getDogPic = async () =>{
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);
        const image = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(`image: ${image}`);  
        await writeFilePro('dog-img.txt', res.body.message);
        console.log('Random dog image saved to file');
        
    } catch (error) {
        console.log('erro:',error);
        throw(err);
    } 

    return '2: ready 🐕';
};

//obteniendo respuesta de getDocPic(); usando then

getDogPic().then( x => {
    console.log('3: done getting dog pics',x);
})
.catch(err=>{
    console.log('error', err);
})

//obteniendo respuesta de getDocPic() usnado aync/await

(async () => {
    try{
        console.log('1: done getting dog pics');
        const res = await getDogPic();
        console.log('2: done getting dog pics', res);
    }catch(err){
        console.log('error', err);
    }
})();


```

## 46. Waiting for multiple promises simultaneosly

Para ejecutar y obtener el valor de múltiples promesas utilizamos la función pasándole un array con las promesas `Promise.all([promise1,promise2,promise3])`

```js
const getDogPic = async () =>{
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        
        const imgs = all.map(el=> el.body.message);
        await writeFilePro('dog-img.txt', imgs.join('\n'));

    } catch (error) {
        console.log('erro:',error);
    } 
};

getDogPic();

```

# 6. Express: Building the Natours API

> Express is a minimal node.js Framework, a higher level of abstraction.

Express contains a very robust set of features: complex routing, easier handling of requests and responses,
middleware, server-side rendering, etc.

Express allows for rapid development of node.js applications: we don't have to re-invent the wheel.

Express makes it easier to organize our application into the MVC architecture.

## 50. Setting up express and basic routing
Inicializamos el proyecto con `npm init` y configurando el package.json inicial.

Instalamos el módulo de express `npm i express`, en este caso se utilizó la versión 4 `npm i express@4`.

En el archivo principal del proyecto `app.js` instanciamos express y configuramos el servidor.

```js
const express = require('express');

//A través de la función express() tendremos acceso a todos los métodos de la librería
const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

```

Definimos el ruteo según los métodos http. Ubicar antes de inicializar el servidor.

```js
app.get('/', (req, res) => {
    res.status(200)
    .json({message:'hello from the server side', app:'Natours'});
});

app.post('/',(req,res) => {
    res.send('You can post to this endpoint');
})
```
## 51. APIs and RESTful API Design




## 67. Environment variables

