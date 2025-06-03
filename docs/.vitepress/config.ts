import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Magic Travel GDD",
  description: "Game Design Document для пошаговой RPG Magic Travel",
  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Идеи', link: '/0_ideas' },
      { text: 'Жанр', link: '/1_genre_and_synopsis/' },
      { text: 'Управление', link: '/2_controls/' },
      { text: 'Системы', link: '/3_systems/' }
    ],

    sidebar: [
      {
        text: '📝 Идеи и Заметки',
        items: [
          { text: 'Идеи', link: '/0_ideas' }
        ]
      },
      {
        text: '🎮 Жанр и Синопсис',
        link: '/1_genre_and_synopsis/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/1_genre_and_synopsis/' },
          { text: 'Простая версия', link: '/1_genre_and_synopsis/1.1_simple_version' },
          { text: 'Полная версия', link: '/1_genre_and_synopsis/1.2_full_version' }
        ]
      },
      {
        text: '🎯 Управление',
        link: '/2_controls/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/2_controls/' },
          { text: 'Геймпад (PlayStation)', link: '/2_controls/2.1_gamepad_ps' },
          { text: 'Клавиатура и мышь', link: '/2_controls/2.2_keyboard_and_mouse' }
        ]
      },
      {
        text: '⚙️ Системы',
        link: '/3_systems/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/3_systems/' },
          { text: 'Руководство по документации', link: '/3_systems/3.0_doc_extension_manual' },
          { text: 'Основные понятия', link: '/3_systems/3.1_base_termins' },
          { text: 'Теги и классификация', link: '/3_systems/3.2_tags_and_classification_system' },
          { text: 'Система ходов', link: '/3_systems/3.3_turn_system' },
          { text: 'Ресурсы и экономика', link: '/3_systems/3.4_resources_and_economy' },
          { text: 'Система действий', link: '/3_systems/3.5_actions_system' },
          { text: 'Система GridMap', link: '/3_systems/3.6_gridmap_system' },
          { text: 'Система состояний', link: '/3_systems/3.7_status_system' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
