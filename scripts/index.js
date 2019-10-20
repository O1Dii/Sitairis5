function appendOption(select, text) {
    const elem = document.createElement('option');
    elem.innerText = text;

    select.appendChild(elem);
}

window.onload = () => {
    const select = document.getElementById('id-select');
    const form = document.getElementById('form');

    const clearButton = document.getElementById('clear-button');
    const deleteButton = document.getElementById('delete-button');
    const showButton = document.getElementById('show-button');

    const name = document.getElementById('name-input');
    const email = document.getElementById('email-input');
    const prod = document.getElementById('prod-input');
    const amount = document.getElementById('amount-input');

    const tableName = document.getElementById('table-name');
    const tableEmail = document.getElementById('table-email');
    const tableProd = document.getElementById('table-prod');
    const tableAmount = document.getElementById('table-amount');

    db = openDatabase("Items", "0.1", "A list of to do items.", 200000);

    if (db) {
        db.transaction(tx => {
            tx.executeSql('SELECT id FROM items', [], (tx, result) => {
                const ids = [].map.call(result.rows, item => item.id);

                ids.forEach(id => appendOption(select, id));
            }, (tx, error) => {
                tx.executeSql('CREATE TABLE IF NOT EXISTS items ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, prod TEXT NOT NULL, amount INTEGER NOT NULL)');
            })
        })
    } else {
        alert('failed connecting to database');
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log(e);

        db.transaction(tx => {
            tx.executeSql('INSERT INTO items (name, email, prod, amount) VALUES (?, ?, ?, ?)', [name.value, email.value, prod.value, amount.value], (tx, result) => { appendOption(select, result.insertId); console.log(result.insertId); }, (tx, error) => { console.log(error); });
        })
    })

    clearButton.addEventListener('click', e => {
        name.value = "";
        email.value = "";
        prod.value = "";
        amount.value = "";
    })

    deleteButton.addEventListener('click', e => {
        const option = select.selectedOptions[0];

        if (option) {
            db.transaction(tx => {
                tx.executeSql('DELETE FROM items WHERE id=?', [option.innerText], (tx, result) => { console.log(result); option.parentNode.removeChild(option); }, (tx, error) => {console.log(error)});
            })
        }
    })

    showButton.addEventListener('click', e => {
        const option = select.selectedOptions[0];

        if (option) {
            db.transaction(tx => {
                tx.executeSql('SELECT id, name, email, prod, amount FROM items WHERE id=?', [option.innerText], (tx, result) => { 
                    tableName.innerText = result.rows[0].name;
                    tableEmail.innerText = result.rows[0].email;
                    tableProd.innerText = result.rows[0].prod;
                    tableAmount.innerText = result.rows[0].amount;

                    console.log(result);
                }, (tx, error) => { console.log(error); });
            })
        }
    })
}