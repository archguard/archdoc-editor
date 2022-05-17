import { Props } from "..";
import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import Example from "./example";

export default {
  title: "Example",
  component: Example,
  argTypes: {
    value: { control: "text" },
    readOnly: { control: "boolean" },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
    onClickHashtag: { action: "hashtag clicked" },
    onClickLink: { action: "link clicked" },
    onHoverLink: { action: "link hovered" },
    onShowToast: { action: "toast" },
    onFocus: { action: "focused" },
    onBlur: { action: "blurred" },
  },
} as Meta;

const Template: Story<Props> = args => <Example {...args} />;

export const Default = Template.bind({});
Default.args = {
  defaultValue: `
  
## DSL

\`\`\`kotlin
@file:DependsOn("org.archguard.scanner:doc-executor:2.0.0-alpha.2")
import org.archguard.dsl.*
var layer = layered {
    prefixId("org.archguard")
    component("controller") dependentOn component("service")
    组件("service") 依赖于 组件("repository")
}
\`\`\`
  
  `,
};
