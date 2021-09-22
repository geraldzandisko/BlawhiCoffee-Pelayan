import {
	StyleSheet
} from 'react-native';

export default StyleSheet.create({
	boldText: {
		fontWeight: "bold"
	},
	loginContainer: {
		flex: 1,
		flexDirection: "row"
	},
	loginRow: {
		width: "50%",
		backgroundColor: "#FFFFFF"
	},
	loginInputContainer: {
		padding: 60
	},
	loginLogoCenter: {
		justifyContent: "center",
		alignItems: "center"
	},
	loginLogo: {
		height: 180,
		width: 180
	},
	loginPhoto: {
		width: "100%",
		height: "100%"
	},
	loginForm: {
		marginTop: 30,
		backgroundColor: "#E3E3E3",
		fontWeight: "bold",
		borderRadius: 5,
		paddingLeft: 20,
		paddingTop: 20,
		paddingBottom: 20
	},
	ToggleButtonStyle: {
		borderWidth: 1,
		borderRadius: 5,
		width: 220,
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 20,
		paddingTop: 20
	},
	ToggleButtonLayout: {
		marginTop: 30,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flex: 1
	},
	loginTitle: {
		marginTop: 30,
		fontWeight: "bold",
		fontSize: 28,
		textAlign: "center"
	},
	loginButtonLayout: {
		marginTop: 30,
		justifyContent: "center",
		alignItems: "center"
	},
	homeContainer: {
		flex: 1,
		flexDirection: "row"
	},
	homeRowLeft: {
		width: "20%",
		padding: 30,
		backgroundColor: "#FFFFFF"
	},
	homeRowRight: {
		width: "80%",
		padding: 30
	},
	homeContent: {
		backgroundColor: "#FFFFFF",
		elevation: 4,
		borderRadius: 5
	},
	navigationText: {
		fontSize: 24
	},
	navigationTextSide: {
		marginLeft: 30
	},
	navigationIconText: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	homeLogo: {
		width: 120,
		height: 120
	},
	logoHomeCenter: {
		marginTop: 30,
		marginBottom: 30,
		justifyContent: "center",
		alignItems: "center"
	},
	horizontalLine: {
		borderBottomColor: 'black',
		borderBottomWidth: 0.5,
		marginTop: 10,
		marginBottom: 10
	},
	headerText: {
		fontSize: 28
	},
	headerTextBold: {
		fontSize: 28,
		fontWeight: 'bold'
	},
	headerTextModal: {
		fontSize: 22,
		fontWeight: 'bold'
	},
	tableHeaderContainer: {
		flexDirection: 'row',
		alignItems: 'stretch'
	},
	tableHeaderBox: {
		flex: 1,
		justifyContent: 'center'
	},
	bodyText: {
		fontSize: 18
	},
	bodyTextBold: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	nomorBodyTextBoldActive: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FEEB75',
		textAlign: 'center'
	},
	nomorBodyTextBoldNon: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#D4D4D4',
		textAlign: 'center'
	},
	nomorTextBoldWhite: {
		fontSize: 38,
		fontWeight: 'bold',
		color: '#FFFFFF'
	},
	tableRowContainer: {
		flexDirection: 'row'
	},
	tableRowBox: {
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'stretch'
	},
	tableRowEach: {
		flex: 1,
		justifyContent: 'center'
	},
	dashboardTableContainer: {
		elevation: 5,
		backgroundColor: '#FFFFFF',
		padding: 30,
		marginTop: 20,
		borderRadius: 5
	},
	currentUserContainer: {
		marginTop: 100,
		alignItems: 'flex-end'
	},
	greyHeaderTable: {
		backgroundColor: '#E3E3E3'
	},
	greyHeaderColor: {
		color: '#7F7F7F'
	},
	greyTablePaddingHeader: {
		paddingLeft: 30,
		paddingRight: 30,
		paddingTop: 20,
		paddingBottom: 20
	},
	greyTablePaddingRow: {
		paddingLeft: 30,
		paddingRight: 30
	},
	greyTableLine: {
		paddingTop: 20,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderColor: '#707070'
	},
	viewPadding: {
		padding: 30
	},
	viewPaddingLeftRight: {
		paddingLeft: 30,
		paddingRight: 30
	},
	marginTopTen: {
		marginTop: 10
	},
	marginTopTwenty: {
		marginTop: 20
	},
	marginTopThirty: {
		marginTop: 30
	},
	TextWarning: {
		color: '#FEEB75'
	},
	TextDanger: {
		color: '#FF2D0F'
	},
	TextBlack: {
		color: '#000000'
	},
	TextGreen: {
		color: '#68E396'
	},
	flexEndText: {
		alignSelf: 'flex-end'
	},
	TextCenter: {
		textAlign: 'center'
	},
	headerWithInput: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 30
	},
	headerInputBox: {
		borderWidth: 1,
		paddingLeft: 20,
		borderRadius: 5
	},
	inputForm: {
		borderWidth: 1,
		paddingLeft: 20,
		borderRadius: 5,
		marginTop: 20	
	},
	inputFormJoint: {
		borderRightWidth: 1,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		paddingLeft: 20,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		flexGrow: 1
	},
	inputFormJointKategori: {
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		flexGrow: 1,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center'
	},
	disabledForm: {
		backgroundColor: '#D4D4D4'
	},
	comboBoxContainer: {
		borderWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 5
	},
	additionalFormContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	addButton: {
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#000000'
	},
	addButtonJoint: {
		padding: 15,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		backgroundColor: '#000000'
	},
	deleteButtonJointKategori: {
		padding: 15,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		backgroundColor: '#FF8675'
	},
	greyButton: {
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#7F7F7F'
	},
	editButton: {
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#68B7E3'
	},
	editButtonTable: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#68B7E3'
	},
	addButtonTable: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#000000'
	},
	cancelButton: {
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#EE6D97'
	},
	TextCancel: {
		color: '#EE6D97'
	},
	deleteButton: {
		padding: 15,
		borderRadius: 5,
		backgroundColor: '#FF8675'
	},
	deleteButtonTable: {
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#FF8675'
	},
	buttonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center'
	},
	buttonTextKategori: {
		color: '#000000',
		fontSize: 18,
		textAlign: 'center'
	},
	formbuttonFortyFive: {
		width: '47%',
	},
	formbuttonHunned: {
		width: '100%',
	},
	contSplitFivty: {
		width: '50%',
		padding: 30
	},
	buttonSpaceLeft: {
		marginLeft: 5
	},
	buttonSpaceRight: {
		marginRight: 5
	},
	nomorActive: {
		width: 120,
		height: 120,
		backgroundColor: '#FEEB75',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	nomorNon: {
		width: 120,
		height: 120,
		backgroundColor: '#D4D4D4',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	nomorAvail: {
		width: 120,
		height: 120,
		backgroundColor: '#000000',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textGrey: {
		color: '#939393'
	},
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modalBox: {
		elevation: 5,
		backgroundColor: '#FFFFFF',
		width: 600,
		padding: 30,
		borderRadius: 5
	},
	flexGrow: {
		flexGrow: 1
	}
})
  