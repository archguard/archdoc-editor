import Node from "../nodes/Node";
import Prism from "../plugins/Prism";
import * as React from "react";
import CellEditor from "./CellEditor";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { NodeSelection, Selection } from "prosemirror-state";
import styled from "styled-components";

const DEFAULT_LANGUAGE = "kotlin";

export class LivingCodeNode extends Node {
  get name() {
    return "code_fence";
  }

  get schema() {
    return {
      attrs: {
        language: {
          default: DEFAULT_LANGUAGE,
          code: "",
        },
      },
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      selectable: true,
      draggable: false,
      parseDOM: [
        { tag: "pre", preserveWhitespace: "full" },
        {
          tag: ".archguard-code",
          preserveWhitespace: "full",
          contentElement: "code",
          getAttrs: (dom: HTMLDivElement) => {
            return {
              code: "",
              language: dom.dataset.language,
            };
          },
        },
      ],
      toDOM: node => {
        return [
          "div",
          { class: "simple-code", "data-language": node.attrs.language },
          ["pre", ["code", { spellCheck: false }, 0]],
        ];
      },
    };
  }

  handleLanguageChange = event => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const language = element.value;

      const transaction = tr
        .setSelection(Selection.near(view.state.doc.resolve(result.inside)))
        .setNodeMarkup(result.inside, undefined, {
          language,
        });
      view.dispatch(transaction);
    }
  };

  get plugins() {
    return [Prism({ name: this.name })];
  }

  component = props => {
    const language = props.attrs?.language || DEFAULT_LANGUAGE;
    const value = props.node.textContent || "";

    // todo: use better way to update code
    const handleChange = (code: string, editor: any) => {
      const { view } = this.editor;
      const { tr } = view.state;
      const element = editor.getDomNode();
      const { top, left } = element.getBoundingClientRect();
      const result = view.posAtCoords({ top, left });

      if (result) {
        const transaction = tr
          .setSelection(Selection.near(view.state.doc.resolve(result.inside)))
          .setNodeMarkup(result.inside, undefined, {
            code,
          });
        view.dispatch(transaction);
      }
    };

    return (
      <StyledCodeBlock onClick={this.handleSelect(props)}>
        <CellEditor
          language={language}
          code={value}
          evalCode={""}
          removeSelf={this.deleteSelf(props)}
          onChange={handleChange}
          changeLanguage={this.handleLanguageChange}
        />
      </StyledCodeBlock>
    );
  };

  inputRules({ type }) {
    return [textblockTypeInputRule(/^```$/, type)];
  }

  toMarkdown(state, node) {
    console.log(node.attrs);
    state.write("```" + (node.attrs.language || "") + "\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
  }

  get markdownToken() {
    return "fence";
  }

  // todo: remove by blocks
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  deleteSelf = ({ getPos }) => () => {
    const { view } = this.editor;
    const $pos = view.state.doc.resolve(getPos());
    const tr = view.state.tr.setSelection(new NodeSelection($pos));
    view.dispatch(tr.deleteSelection());
    view.focus();
  };

  parseMarkdown() {
    return {
      block: "code_fence",
      getAttrs: tok => ({ language: tok.info }),
    };
  }

  handleSelect = ({ getPos }) => event => {
    event.preventDefault();

    const { view } = this.editor;
    const $pos = view.state.doc.resolve(getPos());
    const transaction = view.state.tr.setSelection(new NodeSelection($pos));
    view.dispatch(transaction);
  };
}

const StyledCodeBlock = styled.div`
  margin: 2px 0;
  border: 2px solid #000;
  border-radius: 2px;
`;
