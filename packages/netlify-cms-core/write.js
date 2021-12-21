
const fs = require('fs');
const path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const localeType = {
  type: 'string',
  minLength: 2,
  maxLength: 10,
  pattern: '^[a-zA-Z-_]+$'
};

const I18N_STRUCTURE = {
  MULTIPLE_FOLDERS: 'multiple_folders',
  MULTIPLE_FILES: 'multiple_files',
  SINGLE_FILE: 'single_file',
}

const i18n = {
  type: 'object',
  properties: {
    structure: {
      type: 'string',
      enum: Object.values(I18N_STRUCTURE)
    },
    locales: {
      type: 'array',
      minItems: 2,
      items: localeType,
      uniqueItems: true
    },
    default_locale: localeType
  }
};

const i18nRoot = _objectSpread(_objectSpread({}, i18n), {}, {
  required: ['structure', 'locales']
});

var _v = _interopRequireDefault(require("uuid/v4"));

const I18N_FIELD = {
  TRANSLATE: "translate",
  DUPLICATE: "duplicate",
  NONE: "none",
}

const i18nField = {
  oneOf: [{
    type: 'boolean'
  }, {
    type: 'string',
    enum: Object.values(I18N_FIELD)
  }]
};


const i18nCollection = {
  oneOf: [{
    type: 'boolean'
  }, i18n]
};

var _registry = require('./dist/esm/lib/registry');
var _formats = require("./dist/esm/formats/formats");

function getWidgetSchemas() {
  const schemas = (0, _registry.getWidgets)().map(widget => ({
    [widget.name]: widget.schema
  }));

  console.dir(schemas);
  return Object.assign(...schemas);
}

function fieldsConfig() {
  const id = (0, _v.default)();
  return {
    $id: `fields_${id}`,
    type: 'array',
    minItems: 1,
    items: {
      // ------- Each field: -------
      $id: `field_${id}`,
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        label: {
          type: 'string'
        },
        widget: {
          type: 'string'
        },
        required: {
          type: 'boolean'
        },
        i18n: i18nField,
        hint: {
          type: 'string'
        },
        pattern: {
          type: 'array',
          minItems: 2,
          items: [{
            oneOf: [{
              type: 'string'
            }, {
              instanceof: 'RegExp'
            }]
          }, {
            type: 'string'
          }]
        },
        field: {
          $ref: `field_${id}`
        },
        fields: {
          $ref: `fields_${id}`
        },
        types: {
          $ref: `fields_${id}`
        }
      },
      select: {
        $data: '0/widget'
      },
      // TODO: not sure what to do here
      selectCases: _objectSpread({}, getWidgetSchemas()),
      required: ['name']
    },
    uniqueItemProperties: ['name']
  };
}

const viewFilters = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      label: {
        type: 'string'
      },
      field: {
        type: 'string'
      },
      pattern: {
        oneOf: [{
          type: 'boolean'
        }, {
          type: 'string'
        }]
      }
    },
    additionalProperties: false,
    required: ['label', 'field', 'pattern']
  }
};
const viewGroups = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      label: {
        type: 'string'
      },
      field: {
        type: 'string'
      },
      pattern: {
        type: 'string'
      }
    },
    additionalProperties: false,
    required: ['label', 'field']
  }
};

function getConfigSchema() {
  return {
    type: 'object',
    properties: {
      backend: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            examples: ['test-repo']
          },
          auth_scope: {
            type: 'string',
            examples: ['repo', 'public_repo'],
            enum: ['repo', 'public_repo']
          },
          cms_label_prefix: {
            type: 'string',
            minLength: 1
          },
          open_authoring: {
            type: 'boolean',
            examples: [true]
          }
        },
        required: ['name']
      },
      local_backend: {
        oneOf: [{
          type: 'boolean'
        }, {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              examples: ['http://localhost:8081/api/v1']
            },
            allowed_hosts: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          additionalProperties: false
        }]
      },
      locale: {
        type: 'string',
        examples: ['en', 'fr', 'de']
      },
      i18n: i18nRoot,
      site_url: {
        type: 'string',
        examples: ['https://example.com']
      },
      display_url: {
        type: 'string',
        examples: ['https://example.com']
      },
      logo_url: {
        type: 'string',
        examples: ['https://example.com/images/logo.svg']
      },
      show_preview_links: {
        type: 'boolean'
      },
      media_folder: {
        type: 'string',
        examples: ['assets/uploads']
      },
      public_folder: {
        type: 'string',
        examples: ['/uploads']
      },
      media_folder_relative: {
        type: 'boolean'
      },
      media_library: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            examples: ['uploadcare']
          },
          config: {
            type: 'object'
          }
        },
        required: ['name']
      },
      publish_mode: {
        type: 'string',
        enum: ['simple', 'editorial_workflow'],
        examples: ['editorial_workflow']
      },
      slug: {
        type: 'object',
        properties: {
          encoding: {
            type: 'string',
            enum: ['unicode', 'ascii']
          },
          clean_accents: {
            type: 'boolean'
          }
        }
      },
      collections: {
        type: 'array',
        minItems: 1,
        items: {
          // ------- Each collection: -------
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            label: {
              type: 'string'
            },
            label_singular: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            folder: {
              type: 'string'
            },
            files: {
              type: 'array',
              items: {
                // ------- Each file: -------
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  label: {
                    type: 'string'
                  },
                  label_singular: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  file: {
                    type: 'string'
                  },
                  preview_path: {
                    type: 'string'
                  },
                  preview_path_date_field: {
                    type: 'string'
                  },
                  fields: fieldsConfig()
                },
                required: ['name', 'label', 'file', 'fields']
              },
              uniqueItemProperties: ['name']
            },
            identifier_field: {
              type: 'string'
            },
            summary: {
              type: 'string'
            },
            slug: {
              type: 'string'
            },
            path: {
              type: 'string'
            },
            preview_path: {
              type: 'string'
            },
            preview_path_date_field: {
              type: 'string'
            },
            create: {
              type: 'boolean'
            },
            publish: {
              type: 'boolean'
            },
            hide: {
              type: 'boolean'
            },
            editor: {
              type: 'object',
              properties: {
                preview: {
                  type: 'boolean'
                }
              }
            },
            format: {
              type: 'string',
              enum: Object.keys(_formats.formatExtensions)
            },
            extension: {
              type: 'string'
            },
            frontmatter_delimiter: {
              type: ['string', 'array'],
              minItems: 2,
              maxItems: 2,
              items: {
                type: 'string'
              }
            },
            fields: fieldsConfig(),
            sortable_fields: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            sortableFields: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            view_filters: viewFilters,
            view_groups: viewGroups,
            nested: {
              type: 'object',
              properties: {
                depth: {
                  type: 'number',
                  minimum: 1,
                  maximum: 1000
                },
                summary: {
                  type: 'string'
                }
              },
              required: ['depth']
            },
            meta: {
              type: 'object',
              properties: {
                path: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string'
                    },
                    widget: {
                      type: 'string'
                    },
                    index_file: {
                      type: 'string'
                    }
                  },
                  required: ['label', 'widget', 'index_file']
                }
              },
              additionalProperties: false,
              minProperties: 1
            },
            i18n: i18nCollection
          },
          required: ['name', 'label'],
          oneOf: [{
            required: ['files']
          }, {
            required: ['folder', 'fields']
          }],
          not: {
            required: ['sortable_fields', 'sortableFields']
          },
          if: {
            required: ['extension']
          },
          then: {
            // Cannot infer format from extension.
            if: {
              properties: {
                extension: {
                  enum: Object.keys(_formats.extensionFormatters)
                }
              }
            },
            else: {
              required: ['format']
            }
          },
          dependencies: {
            frontmatter_delimiter: {
              properties: {
                format: {
                  enum: _formats.frontmatterFormats
                }
              },
              required: ['format']
            }
          }
        },
        uniqueItemProperties: ['name']
      },
      editor: {
        type: 'object',
        properties: {
          preview: {
            type: 'boolean'
          }
        }
      }
    },
    required: ['backend', 'collections'],
    anyOf: [{
      required: ['media_folder']
    }, {
      required: ['media_library']
    }]
  };
}

const schema = getConfigSchema();

const filePath = path.join(process.cwd(), 'config.schema.json');

fs.writeFileSync(filePath, JSON.stringify(schema), 'utf-8');