export default [
	{ heading: "home.PersonalInformation" },
	{
		title: "home.PersonalCenter",
		icon: { icon: "ri-home-smile-line" },
		children: [
			{
				title: "home.UserInfo",
				icon: { icon: "ri-user-line" },
				to: "personalCenter-userInfo",
			},
			{
				title: "home.RightsInformation",
				icon: { icon: "ri-function-line" },
				to: "personalCenter-rightsInformation",
			},
			{
				title: "home.Settings",
				icon: { icon: "ri-settings-4-line" },
				to: "personalCenter-changePassword",
			},
			{
				title: "home.AnalysisRecord",
				icon: { icon: "ri-file-list-3-line" },
				to: "personalCenter-analysisRecord",
			},
			{
				title: "home.OrderManagement",
				icon: { icon: "ri-shopping-cart-2-line" },
				to: "personalCenter-orderManagement",
			},
			{
				title: "home.InvoiceApplication",
				icon: { icon: "ri-coupon-line" },
				to: "personalCenter-invoiceApplication",
			},
			{
				title: "home.MyFeedback",
				icon: { icon: "ri-feedback-line" },
				to: "personalCenter-myFeedback",
			},
			{
				title: "home.MyCollection",
				icon: { icon: "ri-star-line" },
				to: "personalCenter-myCollection",
			},
		],
	},
];
