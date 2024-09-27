export default defineNuxtConfig({
	ssr: false,
	devtools: { enabled: false },
	modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],

	googleFonts: {
		families: {
			Roboto: true,
			Lato: true,
			Lora: true,
		},
		display: 'swap',
	},

	imports: {
		presets: [
			{
				from: 'naive-ui',
				imports: ['useMessage', 'useLoadingBar'],
			},
			{
				from: '@vue-flow/core',
				imports: [
					'VueFlow',
					'useVueFlow',
					'Position',
					'Handle',
					'BaseEdge',
					'EdgeLabelRenderer',
					'getBezierPath',
					'MarkerType',
				],
			},
			{
				from: '@vue-flow/background',
				imports: ['Background'],
			},
			{
				from: '@vue-flow/controls',
				imports: ['Controls', 'ControlButton'],
			},
			{
				from: '@vueuse/core',
				imports: ['TransitionPresets', 'useTransition'],
			},
		],
	},
});