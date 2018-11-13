export let orders = [
	{
		userId: 1,
		receiverName: 'jane doe',
		receiverEmail: 'jane.doe@gmail.com',
		receiverPhone: '07062541254',
		parcelId: 1,
		parcelName: '1 bag of rice',
		parcelWeight: 50,
		orderPrice: 2540,
		address: '14 Oladikpo street ojota',
		city: 'lagos',
		country: 'nigeria',
		orderDate: 1541500967206,
		delivered: false,
		inTransit: true,
		cancelled: false
	},

	{
		userId: 1,
		receiverName: 'susan doe',
		receiverEmail: 'susan.doe@gmail.com',
		receiverPhone: '08083651245',
		parcelId: 2,
		parcelName: 'Green suit',
		parcelWeight: 0.1,
		orderPrice: 125,
		address: '12 ololo street ololo',
		city: 'lagos',
		country: 'nigeria',
		orderDate: 1541500967206,
		delivered: true,
		inTransit: false,
		cancelled: false
	},

	{
		userId: 2,
		receiverName: 'susan rice',
		receiverEmail: 'susan.rice@gmail.com',
		receiverPhone: '08085651245',
		parcelId: 4,
		parcelName: 'Travel documents',
		parcelWeight: 0.1,
		orderPrice: 111,
		address: '12 ololo street omomo',
		city: 'lagos',
		country: 'nigeria',
		orderDate: 1541500967206,
		delivered: false,
		inTransit: false,
		cancelled: true
	}
];
