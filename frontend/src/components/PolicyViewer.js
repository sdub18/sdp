import { React, useState, useCallback } from "react";
import { Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { GridActionsCellItem } from "@mui/x-data-grid";

const init_rows = [
	{ id: 1, type: "Averaging", data: "Current", period: "5 min", description: "Current > 300 mA"},
	{ id: 2, type: "Simple", data: "Current", period: "3 min", description: "Current < 200 mA"},
	{ id: 3, type: "Simple", data: "Voltage", period: "2 min", description: "Voltage < 12 V"}
]

export default function PolicyViewer(props) {
	const [rows, setRows] = useState(init_rows);


	const handleDelete = useCallback((id) => () => {
		props.delete(id);	
		setTimeout(() => {
		setRows((prevRows) => prevRows.filter((row) => row.id !== id));
		});
	},
	[],);

	const columns = [
		{field: 'id', headerName:'id', width: 60},
		{field: 'type', headerName: 'Policy Type', width: 200},
		{field: 'data', headerName: 'Data Type', width: 200},
		{field: 'period', headerName: 'Period', width: 200},
		{field: 'description', headerName: 'Description', sortable: false, width: 400},	
		{
			field: 'actions',
			type: 'actions',
			width: 60,
			align: 'center',
			getActions: (params) => [
			  <GridActionsCellItem
				icon={<CloseIcon fontSize="large" />}
				label="Delete"
				onClick={handleDelete(params.id)}
			  />,
			],
		  },
	]


	return (
		<div className='policy-viewer'>
			<Stack
				alignItems='center'
				justifyContent='center'
			>
				<DataGrid rows={rows} columns={columns}
					sx={{ 
						width: '95%',
						fontSize: 18,
						fontWeight: 'bold',
						bgcolor: 'white',
						'.MuiDataGrid-columnSeparator': {
							display: 'none',
					  	},
						".MuiDataGrid-columnHeaderTitle": {
							fontWeight: 'bold'
						},
						"& .MuiDataGrid-columnHeaders": {
							backgroundColor: "#3F51B5",
							color: "black",
							fontSize: 26,
						},
						'&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
							outline: 'none',
						},
					}}
					density='comfortable'
					autoHeight
					hideFooter
					disableColumnResize
					disableColumnMenu
				/>
			</Stack>
		</div>
	);
}