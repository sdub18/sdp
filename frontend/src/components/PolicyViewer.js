import { React, useState, useCallback } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


export default function PolicyViewer({policies, deletePolicy}) {
	const [rows, setRows] = useState([]);


	const handleDelete = useCallback((id) => () => {
		deletePolicy(id);	
		setTimeout(() => {
		setRows((prevRows) => prevRows.filter((row) => row.id !== id));
		});
	},
	[],);

	const columns = [
		{field: 'id', headerName:'id', width: 80},
		{field: 'policyType', headerName: 'Policy Type', width: 200},
		{field: 'dataType', headerName: 'Data Type', width: 200},
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
				<DataGrid rows={policies} columns={columns}
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