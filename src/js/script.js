const URL = 'https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users';
const tableContent = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const input = document.getElementById('form-input');
const sortButtons = document.getElementById('sort-buttons');
const modalWindow = document.getElementById('modal');
const clearButton = document.getElementById('clear-button');

let usersList = [];

const getData = async url => {
    const response = await fetch(url);
    const data = await response.json();
    usersList = data;
    return usersList;
}

getData(URL)
    .then(users => {


        let currentPage = 1;
        let usersPerPage = 5;

        const renderTable = (data, page = currentPage, rows = usersPerPage) => {
            tableContent.innerHTML = '';

            page--;

            const startIndex = page * rows;
            console.log(startIndex)
            const endIndex = startIndex + rows;
            const itemsPerPage = data.slice(startIndex, endIndex);



            for (let i = 0; i < itemsPerPage.length; i++) {
                const date = new Date(itemsPerPage[i].registration_date).toLocaleDateString();
                const id = startIndex + i;
                const tableRow = `
                <tr id="${id}">
                    <td>${itemsPerPage[i].username}</td>
                    <td>${itemsPerPage[i].email}</td>
                    <td>${date}</td>
                    <td>${itemsPerPage[i].rating}</td>
                    <td class="delete">&times;</td>
                    
                </tr>
                `;
                tableContent.innerHTML += tableRow;
            }


        }





        const setPagination = totalItems => {
            pagination.innerHTML = '';

            const pages = Math.ceil(totalItems / usersPerPage);

            for(let i = 1; i <= pages; i++) {
                const item = document.createElement('li');
                item.classList.add('pagination__row');
                item.textContent = i;
                item.dataset.value = i;
                pagination.appendChild(item);
            }

        }

        const setPage = function (event) {
            const currentItem = event.target;
            const pageItems = event.target.closest('li');
            console.log(currentItem)

            if (!pageItems) {
                return;
            } else {
                if (currentItem.classList.contains('pagination__row_active')) {
                    currentItem.classList.remove('pagination__row_active');
                }
                currentPage = event.target.dataset.value;
                renderTable(users);
            }
        }

        let isAsc = true;
        let isFiltered = false;


        const sort = function (event) {
            clearButton.classList.add('user-form__clear_active')
            const sortType = event.target.dataset.value;

            (sortType === 'rating') ? sortUsersRating(users) : sortUsersDate(users);
        }

        const sortByDefault = () => {
            const defaultSort = users.sort((a, b) => {
                return a.id - b.id;
            })
            renderTable(defaultSort);
            setPagination(defaultSort.length)
        }

        const sortUsersRating = data => {
            isAsc = !isAsc;
            isFiltered = true;
            const sortedUsers = data.sort((a, b) => {
                return isAsc ? a.rating - b.rating : b.rating - a.rating;
            })
            renderTable(sortedUsers);
        }

        const sortUsersDate = data => {
            isAsc = !isAsc;
            isFiltered = true;
            const sortedUsers = data.sort((a, b) => {
                return isAsc ? +new Date(a.registration_date) - +new Date(b.registration_date) : +new Date(b.registration_date) - +new Date(a.registration_date);
            })
            renderTable(sortedUsers);
        }

        const clearFilter = e => {
            e.preventDefault();
            input.value = '';
            e.target.classList.remove('user-form__clear_active');
            sortByDefault(users);
        }

        clearButton.addEventListener('click', clearFilter);

        input.addEventListener('keyup', () => {
            console.log(input.value.length)
            if (input.value.length != '') {
                clearButton.classList.add('user-form__clear_active');
            } else {
                clearButton.classList.remove('user-form__clear_active');
            }
        })





        setPagination(users.length);
        renderTable(users);



        console.log(users)


        const deleteUser = id => {
            const deleted = users.splice(id,1);
            console.log(users)
            console.log(id)
            console.log(deleted)
            const totalLength = users.length - deleted.length;

            renderTable(users);
            setPagination(totalLength);
        } // true

        const showModal = () => {
            modalWindow.classList.add('modal_active');
        }
        let id = 0;

        const getAnswer = (event, item = id) => {
            modalWindow.classList.add('modal_active');
            console.log(event.target)
            const data = item;

            if(event.target.value !== 'yes') {
                removeModal();
            } else {
                deleteUser(data);
                removeModal();
            }

        }

        const removeModal = () => {
            modalWindow.classList.remove('modal_active');
        }

        const getCurrentRow = function (event) {
            const tableRow = event.target.parentElement;
            id = +tableRow.attributes.id.value;

            if (event.target.classList.value !== 'delete') {
                return;
            } else {
                showModal();
            }

        }


        tableContent.addEventListener('click', getCurrentRow.bind(tableContent));
        modalWindow.addEventListener('click', getAnswer.bind(modalWindow))





        pagination.addEventListener('click', setPage.bind(pagination));

        input.addEventListener('keyup', event => {
            const searchValue = event.target.value.toLowerCase();

            const foundUsers = users.filter(user => {
                return user.username.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue);
            })
            console.log(foundUsers)
            setPagination(foundUsers.length);
            renderTable(foundUsers, 1);
        })

        sortButtons.addEventListener('click', sort.bind(sortButtons));
        clearButton.addEventListener('click', sortByDefault);
    })