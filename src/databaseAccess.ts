const [merchants, setMerchants] = useState(false);
  
async function executeCustomQuery() {
  const query = 'SELECT * FROM users';  // Replace with your SQL query

  try {
    const response = await fetch(`http://localhost:3000/custom-query?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);  // Handle the data received from the server
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}  
  function getMerchant() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setMerchants(data);
      });
  }

  function createMerchant() {
    let name = prompt('Enter merchant name');
    let email = prompt('Enter merchant email');
    fetch('http://localhost:3001/merchants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  function deleteMerchant() {
    let id = prompt('Enter merchant id');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  function updateMerchant() {
    let id = prompt('Enter merchant id');
    let name = prompt('Enter new merchant name');
    let email = prompt('Enter new merchant email');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }

  useEffect(() => {
    getMerchant();
  }, []);