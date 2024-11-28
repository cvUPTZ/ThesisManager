import { COMMANDS } from './commands';

export interface CommandHelp {
  description: string;
  syntax: string;
  example: string;
}

export const HELP_TEXT: Record<string, CommandHelp> = {
  [COMMANDS.START]: {
    description: 'Initiate bot interaction and show welcome message',
    syntax: '/start',
    example: '/start'
  },
  [COMMANDS.HELP]: {
    description: 'Display comprehensive command guide',
    syntax: '/help [command]',
    example: '/help add_chapter'
  },
  [COMMANDS.ABOUT]: {
    description: 'Show bot information and version details',
    syntax: '/about',
    example: '/about'
  },
  [COMMANDS.SETTINGS]: {
    description: 'Access bot configuration options',
    syntax: '/settings',
    example: '/settings'
  },
  [COMMANDS.STATUS]: {
    description: 'View current thesis progress and metadata',
    syntax: '/status',
    example: '/status'
  },
  [COMMANDS.SET_TITLE]: {
    description: 'Set the thesis title',
    syntax: '/set_title <title>',
    example: '/set_title Machine Learning Applications in Healthcare'
  },
  [COMMANDS.SET_FIELD]: {
    description: 'Define research field/discipline',
    syntax: '/set_field <field>',
    example: '/set_field Computer Science'
  },
  [COMMANDS.SET_SUPERVISOR]: {
    description: 'Add thesis supervisor details',
    syntax: '/set_supervisor <name>',
    example: '/set_supervisor Dr. Jane Smith'
  },
  [COMMANDS.SET_UNIVERSITY]: {
    description: 'Specify academic institution',
    syntax: '/set_university <name>',
    example: '/set_university Stanford University'
  },
  [COMMANDS.INITIALIZE_TEMPLATE]: {
    description: 'Select thesis document template',
    syntax: '/initialize_template <APA|MLA|Chicago>',
    example: '/initialize_template APA'
  },
  [COMMANDS.ADD_CHAPTER]: {
    description: 'Create new thesis chapter',
    syntax: '/add_chapter <title>',
    example: '/add_chapter Literature Review'
  },
  [COMMANDS.LIST_CHAPTERS]: {
    description: 'Display all existing chapters',
    syntax: '/list_chapters',
    example: '/list_chapters'
  },
  [COMMANDS.EDIT_CHAPTER]: {
    description: 'Modify chapter title',
    syntax: '/edit_chapter <chapter_id> <new_title>',
    example: '/edit_chapter ch1 Updated Literature Review'
  },
  [COMMANDS.DELETE_CHAPTER]: {
    description: 'Remove a chapter',
    syntax: '/delete_chapter <chapter_id>',
    example: '/delete_chapter ch1'
  },
  [COMMANDS.REORDER_CHAPTERS]: {
    description: 'Change chapter sequence',
    syntax: '/reorder_chapters <chapter_id1> <chapter_id2> ...',
    example: '/reorder_chapters ch2 ch1 ch3'
  },
  [COMMANDS.ADD_SECTION]: {
    description: 'Create new section in specific chapter',
    syntax: '/add_section <chapter_id> <title>',
    example: '/add_section ch1 Research Methods'
  },
  [COMMANDS.LIST_SECTIONS]: {
    description: 'Show all sections in a chapter',
    syntax: '/list_sections <chapter_id>',
    example: '/list_sections ch1'
  },
  [COMMANDS.EDIT_SECTION]: {
    description: 'Modify section title',
    syntax: '/edit_section <chapter_id> <section_id> <new_title>',
    example: '/edit_section ch1 sec1 Updated Methods'
  },
  [COMMANDS.DELETE_SECTION]: {
    description: 'Remove a section',
    syntax: '/delete_section <chapter_id> <section_id>',
    example: '/delete_section ch1 sec1'
  },
  [COMMANDS.MERGE_SECTIONS]: {
    description: 'Combine two sections',
    syntax: '/merge_sections <chapter_id> <source_section_id> <target_section_id>',
    example: '/merge_sections ch1 sec1 sec2'
  },
  [COMMANDS.ADD_CONTENT]: {
    description: 'Add content to a specific section',
    syntax: '/add_content <section_id> <content>',
    example: '/add_content sec1 This section discusses...'
  },
  [COMMANDS.EDIT_CONTENT]: {
    description: 'Modify section content',
    syntax: '/edit_content <section_id> <content>',
    example: '/edit_content sec1 Updated content...'
  },
  [COMMANDS.VIEW_CONTENT]: {
    description: 'Display section content',
    syntax: '/view_content <section_id>',
    example: '/view_content sec1'
  },
  [COMMANDS.EXPORT_CONTENT]: {
    description: 'Export thesis in specified format',
    syntax: '/export_content [format]',
    example: '/export_content docx'
  },
  [COMMANDS.ADD_REFERENCE]: {
    description: 'Add a new academic reference',
    syntax: '/add_reference <json_reference>',
    example: '/add_reference {"title": "Example Paper", "authors": ["John Doe"], "year": 2024}'
  },
  [COMMANDS.SEARCH_REFERENCES]: {
    description: 'Find references by keyword',
    syntax: '/search_references <query>',
    example: '/search_references machine learning'
  },
  [COMMANDS.GENERATE_BIBLIOGRAPHY]: {
    description: 'Create bibliography based on added references',
    syntax: '/generate_bibliography',
    example: '/generate_bibliography'
  },
  [COMMANDS.SET_CITATION_STYLE]: {
    description: 'Change citation format',
    syntax: '/set_citation_style <APA|MLA|Chicago>',
    example: '/set_citation_style APA'
  },
  [COMMANDS.ADD_FIGURE]: {
    description: 'Add figure to a section',
    syntax: '/add_figure <section_id> <url> <caption>',
    example: '/add_figure sec1 https://example.com/image.jpg "Figure 1: Results Graph"'
  },
  [COMMANDS.REMOVE_FIGURE]: {
    description: 'Remove figure from section',
    syntax: '/remove_figure <section_id> <figure_id>',
    example: '/remove_figure sec1 fig1'
  },
  [COMMANDS.LIST_FIGURES]: {
    description: 'List all figures in a section',
    syntax: '/list_figures [section_id]',
    example: '/list_figures sec1'
  },
  [COMMANDS.UPDATE_CAPTION]: {
    description: 'Update figure caption',
    syntax: '/update_caption <section_id> <figure_id> <new_caption>',
    example: '/update_caption sec1 fig1 "Updated Figure Caption"'
  },
};