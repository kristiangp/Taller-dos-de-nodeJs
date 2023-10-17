const express = require('express');
const moment = require('moment');
const app = express();
const fs = require('fs');
app.set('view engine', 'ejs');

app.get('/products', (req, res) => {
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const productsData = JSON.parse(data);
      res.render('products', { products: productsData });
    }
  });
});

app.get('/persons', (req, res) => {
    // Crear una entrada con fecha y hora actual
    const accessData = {
      timestamp: moment().format(),
    };
  
    // Leer el archivo access.json de manera asincrónica
    fs.readFile('./access.json', 'utf8', (err, accessFile) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al leer access.json');
      }
      const accessArray = JSON.parse(accessFile);
  
      // Agregar la nueva entrada al arreglo
      accessArray.push(accessData);
  
      // Guardar el arreglo actualizado en access.json de manera asincrónica
      fs.writeFile('./access.json', JSON.stringify(accessArray, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error al escribir en access.json');
        }
  
        // Filtra y muestra personas mayores de 5475 días
        fs.readFile('./persons.json', 'utf8', (err, personsFile) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error al leer persons.json');
          }
          const personsData = JSON.parse(personsFile);
  
          const currentDate = moment();
          const filteredPersons = personsData.filter(person => {
            const birthDate = moment(person.date_of_birth);
            const ageInDays = currentDate.diff(birthDate, 'days');
            return ageInDays > 5475;
          });
  
          // Ahora, creamos una nueva persona
          const newPerson = {
            name: 'Nueva Persona dos',
            date_of_birth: '2013-01-01', // Ajusta esta fecha según tus necesidades
          };
  
          // Añadimos la nueva persona al arreglo de personas
          personsData.push(newPerson);
  
          // Volvemos a escribir el arreglo de personas en el archivo persons.json
          fs.writeFile('./persons.json', JSON.stringify(personsData, null, 2), (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Error al escribir en persons.json');
            }
  
            // Renderiza la plantilla EJS y pasa los datos
            res.render('persons', { persons: filteredPersons });
          });
        });
      });
    });
  });
  
  
app.listen(3000, () => {
  console.log('La aplicación está funcionando en http://localhost:3000');
});
