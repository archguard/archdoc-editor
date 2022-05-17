import Node from "../nodes/Node";
import Prism from "../plugins/Prism";
import * as React from "react";
import CellEditor from "./CellEditor";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { NodeSelection } from "prosemirror-state";
import styled from "styled-components";

export class LivingCodeNode extends Node {
  get name() {
    return "living_code";
  }

  get schema() {
    return {
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

  get plugins() {
    return [Prism({ name: this.name })];
  }

  component = props => {
    const language = props.attrs?.language || "kotlin";
    const value = props.node.textContent || "";

    return (
      <StyledCodeBlock onClick={this.handleSelect(props)}>
        <CellEditor
          language={language}
          code={value}
          evalCode={""}
          removeSelf={this.deleteSelf(props)}
        />
      </StyledCodeBlock>
    );
  };

  inputRules({ type }) {
    return [textblockTypeInputRule(/^```$/, type)];
  }

  toMarkdown(state, node) {
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
      block: "living_code",
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
