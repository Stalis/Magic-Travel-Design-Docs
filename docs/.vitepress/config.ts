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
      { text: '0. Идеи', link: '/0_ideas' },
      { text: '1. Жанр и Синопсис', link: '/1_genre_and_synopsis/' },
      { text: '2. Управление', link: '/2_controls/' },
      { text: '3. Основные понятия', link: '/3_base_concepts/' },
      { text: '4. Стиль игры', link: '/4_game_style/' },
      { text: '5. Системы', link: '/5_systems/' },
      { text: '6. Механики', link: '/6_mechanics/' },
      { text: '7. Параметры', link: '/7_parameters/' }
    ],

    sidebar: [
      {
        text: '📝 0. Идеи и Заметки',
        link: '/0_ideas',
        collapsed: false,
        items: [
        ]
      },
      {
        text: '🎭 1. Жанр и Синопсис',
        link: '/1_genre_and_synopsis/',
        collapsed: false,
        items: [
          { text: '1.1 Простая версия', link: '/1_genre_and_synopsis/1.1_simple_version' },
          { text: '1.2 Полная версия', link: '/1_genre_and_synopsis/1.2_full_version' }
        ]
      },
      {
        text: '🎮 2. Управление',
        link: '/2_controls/',
        collapsed: false,
        items: [
          { text: '2.1 Геймпад (PlayStation)', link: '/2_controls/2.1_gamepad_ps' },
          { text: '2.2 Клавиатура и мышь', link: '/2_controls/2.2_keyboard_and_mouse' }
        ]
      },
      {
        text: '📚 3. Основные понятия',
        link: '/3_base_concepts/',
        collapsed: false,
        items: [
          { text: '3.1 Системы и механики', link: '/3_base_concepts/3.1_system_and_mechanic' }
        ]
      },
      {
        text: '🎨 4. Стиль игры',
        link: '/4_game_style/',
        collapsed: false,
        items: [
        ]
      },
      {
        text: '⚙️ 5. Системы',
        link: '/5_systems/',
        collapsed: false,
                items: [
          { text: '5.0 Руководство по документации', link: '/5_systems/5.0_doc_extension_manual' },
          { text: '5.1 Теги и классификация', link: '/5_systems/5.1_tags_and_classification_system' },
          { text: '5.2 Пространство и навигация', link: '/5_systems/5.2_space_and_navigation_system' },
          { text: '5.3 Ресурсы и экономика', link: '/5_systems/5.3_resources_and_economy' },
          { text: '5.4 Характеристики', link: '/5_systems/5.4_character_stats_system' },
          { text: '5.5 Состояния', link: '/5_systems/5.5_status_system' },
          { text: '5.6 Инвентарь', link: '/5_systems/5.6_inventory_system' },
          { text: '5.7 Ходы', link: '/5_systems/5.7_turn_system' },
          { text: '5.8 Действия', link: '/5_systems/5.8_actions_system' }
        ]
      },
      {
        text: '🎲 6. Механики',
        link: '/6_mechanics/',
        collapsed: false,
        items: [
          { text: '6.1 Механика боя', link: '/6_mechanics/6.1_combat_mechanic' }
        ]
      },
      {
        text: '⚙️ 7. Параметры',
        link: '/7_parameters/',
        collapsed: false,
        items: [
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
