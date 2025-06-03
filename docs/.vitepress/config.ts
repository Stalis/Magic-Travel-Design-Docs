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
      { text: 'Основные понятия', link: '/3_base_concepts/' },
      { text: 'Стиль игры', link: '/4_game_style/' },
      { text: 'Системы', link: '/5_systems/' },
      { text: 'Механики', link: '/6_mechanics/' }
    ],

    sidebar: [
      {
        text: '📝 Идеи и Заметки',
        items: [
          { text: 'Идеи', link: '/0_ideas' }
        ]
      },
      {
        text: '🎯 Жанр и Синопсис',
        link: '/1_genre_and_synopsis/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/1_genre_and_synopsis/' },
          { text: 'Простая версия', link: '/1_genre_and_synopsis/1.1_simple_version' },
          { text: 'Полная версия', link: '/1_genre_and_synopsis/1.2_full_version' }
        ]
      },
      {
        text: '🎮 Управление',
        link: '/2_controls/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/2_controls/' },
          { text: 'Геймпад (PlayStation)', link: '/2_controls/2.1_gamepad_ps' },
          { text: 'Клавиатура и мышь', link: '/2_controls/2.2_keyboard_and_mouse' }
        ]
      },
      {
        text: '📚 Основные понятия',
        link: '/3_base_concepts/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/3_base_concepts/' },
          { text: 'Системы и механики', link: '/3_base_concepts/3.1_system_and_mechanic' }
        ]
      },
      {
        text: '🎨 Стиль игры',
        link: '/4_game_style/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/4_game_style/' }
        ]
      },
      {
        text: '⚙️ Системы',
        link: '/5_systems/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/5_systems/' },
          { text: 'Руководство по документации', link: '/5_systems/5.0_doc_extension_manual' },
          { text: 'Теги и классификация', link: '/5_systems/5.1_tags_and_classification_system' },
          { text: 'Система ходов', link: '/5_systems/5.2_turn_system' },
          { text: 'Ресурсы и экономика', link: '/5_systems/5.3_resources_and_economy' },
          { text: 'Система действий', link: '/5_systems/5.4_actions_system' },
          { text: 'Система GridMap', link: '/5_systems/5.5_gridmap_system' },
          { text: 'Система состояний', link: '/5_systems/5.6_status_system' }
        ]
      },
      {
        text: '🎲 Механики',
        link: '/6_mechanics/',
        collapsed: false,
        items: [
          { text: 'Обзор', link: '/6_mechanics/' },
          { text: 'Механика боя', link: '/6_mechanics/6.1_combat_mechanic' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
